import { action, makeObservable, observable } from 'mobx'
import * as kiwi from "kiwi.js";
import { Node } from "@antv/x6";
import React from 'react';

export default class LayoutStore {
  solver;
  size_data;
  computed_size;
  isClassDiagram = true;

  constructor() {
    this.solver = new kiwi.Solver();
    this.size_data = {};
    this.computed_size = {};
    makeObservable(this, {
      solver: observable.ref,
      size_data: observable,
      computed_size: observable,
      isClassDiagram: observable,
      size_calc: action,
      propogate_updates: action,
      get_root: action,
      add_node: action,
      update_parent: action
    });
  }

  size_calc(e: any, type: string) {
    console.log(type, e);
    const node: Node = e.node;

    let changed_ids = this.propogate_updates(this.get_root(node.id));

    if (type === "add") {
      this.add_node(node);
    }
    else if (type === "embed") {

      // remove from old parent
      if (e.previous) {
        const parent_id = e.previous;

        const parent = this.size_data[parent_id];
        this.solver.removeConstraint(parent.children.data[node.id]);
        delete parent.children.data[node.id];

        this.update_parent(parent_id);

        const updated = this.size_data[node.id];
        for (const constraint of updated.parent.constraints) {
          this.solver.removeConstraint(constraint);
        }
        updated.parent = null;
      }

      // add to new parent
      if (e.current) {
        const parent_id = e.current;

        this.add_node(node);

        const updated = this.size_data[node.id];
        updated.parent = {
          id: parent_id,
          constraints: [],
        };

        const parent = this.size_data[parent_id];
        parent.children.data[node.id] = null;

        updated.parent.constraints = [
          new kiwi.Constraint(updated.width, kiwi.Operator.Eq,
            new kiwi.Expression(parent.width, -parent.padding.right, -parent.padding.left),
            kiwi.Strength.required),
          new kiwi.Constraint(updated.left, kiwi.Operator.Eq,
            new kiwi.Expression(parent.left, parent.padding.left), kiwi.Strength.required),
        ];
        for (const constraint of updated.parent.constraints) {
          this.solver.addConstraint(constraint);
        }

        this.update_parent(parent_id);
      }

      this.solver.suggestValue(this.size_data[node.id].left, node.position().x);
      this.solver.suggestValue(this.size_data[node.id].top, node.position().y);

    }
    else if (type === "move") {
      this.solver.suggestValue(this.size_data[node.id].left, node.position().x);
      this.solver.suggestValue(this.size_data[node.id].top, node.position().y);
    }
    else if (type === "resize") {
      this.solver.suggestValue(this.size_data[node.id].width, node.size().width);
      this.solver.suggestValue(this.size_data[node.id].height, node.size().height);
      this.solver.suggestValue(this.size_data[node.id].left, node.position().x);
      this.solver.suggestValue(this.size_data[node.id].top, node.position().y);
    }
    else if (type === "remove") {
      const removed = this.size_data[node.id];

      if (removed.parent) {
        const parent_id = this.size_data[node.id].parent.id;
        const parent = this.size_data[parent_id];
        this.solver.removeConstraint(parent.children.data[node.id]);
        delete parent.children.data[node.id];

        this.update_parent(parent_id);

        for (const constraint of removed.parent.constraints) {
          this.solver.removeConstraint(constraint);
        }
      }

      // embed events should've already removed children from `updated` component

      for (const constraint of removed.constraints) {
        this.solver.removeConstraint(constraint);
      }
      this.solver.removeEditVariable(removed.top);
      this.solver.removeEditVariable(removed.left);
      this.solver.removeEditVariable(removed.width);
      this.solver.removeEditVariable(removed.height);

      delete this.size_data[node.id];
      delete this.computed_size[node.id];
    }

    changed_ids = [...changed_ids, ...this.propogate_updates(this.get_root(node.id))];

    this.solver.updateVariables();
    for (const id of changed_ids) {
      const sizes = this.size_data[id];
      if (!sizes) { // node deleted
        continue;
      }
      this.computed_size[id] = {
        width: sizes.width.value(),
        height: sizes.height.value(),
        top: sizes.top.value(),
        left: sizes.left.value(),
      };
    }

  }

  propogate_updates(root_id: string) {
    let changed_ids: any = new Set([root_id]);
    const current = this.size_data[root_id];
    if (!current) {
      return changed_ids;
    }
    for (const child_id of Object.keys(current.children.data)) {
      changed_ids = [...changed_ids, ...this.propogate_updates(child_id)];
    }
    return changed_ids;
  }


  get_root(id: string) {
    let current = this.size_data[id];
    let c_id = id;
    if (!current) {
      return c_id;
    }
    while (current.parent) {
      c_id = current.parent.id;
      current = this.size_data[c_id];
    }
    return c_id;
  }

  add_node(node: Node) {
    if (!this.size_data[node.id]) {
      this.size_data[node.id] = {
        children: { data: {}, constraint: null },
        parent: null,
        top: new kiwi.Variable(),
        left: new kiwi.Variable(),
        width: new kiwi.Variable(),
        height: new kiwi.Variable(),
        padding: null,
        constraints: [],
      };
      const n = this.size_data[node.id];

      n.constraints = [
        new kiwi.Constraint(n.width, kiwi.Operator.Ge, 120, kiwi.Strength.required),
        new kiwi.Constraint(n.height, kiwi.Operator.Ge, 20, kiwi.Strength.required)
      ];

      if (node.shape === "field") {
        this.solver.addEditVariable(n.top, kiwi.Strength.weak);
        this.solver.addEditVariable(n.left, kiwi.Strength.weak);
        this.solver.addEditVariable(n.width, kiwi.Strength.weak);
        this.solver.addEditVariable(n.height, kiwi.Strength.strong);
        n.padding = { top: 0, bottom: 0, left: 0, right: 0 };
      }
      else if (node.shape === "compartment") {
        this.solver.addEditVariable(n.top, kiwi.Strength.medium);
        this.solver.addEditVariable(n.left, kiwi.Strength.medium);
        this.solver.addEditVariable(n.width, kiwi.Strength.weak);
        this.solver.addEditVariable(n.height, kiwi.Strength.weak);
        n.padding = { top: 20, bottom: 3, left: 3, right: 3 };
      }
      else if (node.shape === "group") {
        this.solver.addEditVariable(n.top, kiwi.Strength.strong);
        this.solver.addEditVariable(n.left, kiwi.Strength.strong);
        this.solver.addEditVariable(n.width, kiwi.Strength.strong);
        this.solver.addEditVariable(n.height, kiwi.Strength.weak);
        n.padding = { top: 30, bottom: 3, left: 3, right: 3 };
      }
      else {
        this.solver.addEditVariable(n.top, kiwi.Strength.strong);
        this.solver.addEditVariable(n.left, kiwi.Strength.strong);
        this.solver.addEditVariable(n.width, kiwi.Strength.strong);
        this.solver.addEditVariable(n.height, kiwi.Strength.weak);
        n.padding = { top: 0, bottom: 0, left: 0, right: 0 };
      }

      this.solver.suggestValue(n.left, node.position().x);
      this.solver.suggestValue(n.top, node.position().y);
      for (const constraint of n.constraints) {
        this.solver.addConstraint(constraint);
      }
      this.computed_size[node.id] = {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      };
    }

  }

  update_parent(parent_id: string) {
    const parent = this.size_data[parent_id]
    if (parent.children.constraint) {
      this.solver.removeConstraint(parent.children.constraint);
      parent.children.constraint = null;
    }
    if (Object.keys(parent.children.data).length !== 0) {
      let parent_size = new kiwi.Expression(parent.padding.top);
      let offset = new kiwi.Expression(parent.top, parent.padding.top);
      for (const child_id in parent.children.data) {
        const child = this.size_data[child_id];
        if (parent.children.data[child_id]) {
          this.solver.removeConstraint(parent.children.data[child_id]);
        }
        const child_offset = new kiwi.Constraint(child.top, kiwi.Operator.Eq, offset, kiwi.Strength.required);
        parent.children.data[child_id] = child_offset;
        this.solver.addConstraint(child_offset);
        offset = new kiwi.Expression(child.top, child.height);
        parent_size = parent_size.plus(child.height);
      }
      parent.children.constraint = new kiwi.Constraint(parent_size.plus(parent.padding.bottom), kiwi.Operator.Eq, parent.height, kiwi.Strength.required);
      this.solver.addConstraint(parent.children.constraint);
    }
  }

  switchShape() {
    this.isClassDiagram = !this.isClassDiagram;
  }

}
