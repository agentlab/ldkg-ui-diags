import { action, observable } from 'mobx'
import * as kiwi from "kiwi.js";
import { Node } from "@antv/x6";

export const layoutStoreConstr = () => ({
  solver: new kiwi.Solver(),
  sizeData: {},
  computedSize: {},
  sizeCalc(e: any, type: string) {
    console.log(type, e);
    const node: Node = e.node;
    let changedIds = this.propogateUpdates(this.getRoot(node.id));

    if (type === "add") {
      this.addNode(node);
    }
    else if (type === "embed") {
      // remove from old parent
      if (e.previous) {
        const parentId = e.previous;

        const parent = this.sizeData[parentId];
        this.solver.removeConstraint(parent.children.data[node.id]);
        delete parent.children.data[node.id];
        this.updateParent(parentId);
        const updated = this.sizeData[node.id];
        for (const constraint of updated.parent.constraints) {
          this.solver.removeConstraint(constraint);
        }
        updated.parent = null;
      }
      // add to new parent
      if (e.current) {
        const parentId = e.current;
        this.addNode(node);
        const updated = this.sizeData[node.id];
        updated.parent = {
          id: parentId,
          constraints: [],
        };
        const parent = this.sizeData[parentId];
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
        this.updateParent(parentId);
      }
      this.solver.suggestValue(this.sizeData[node.id].left, node.position().x);
      this.solver.suggestValue(this.sizeData[node.id].top, node.position().y);
    }
    else if (type === "move") {
      this.solver.suggestValue(this.sizeData[node.id].left, node.position().x);
      this.solver.suggestValue(this.sizeData[node.id].top, node.position().y);
    }
    else if (type === "resize") {
      this.solver.suggestValue(this.sizeData[node.id].width, node.size().width);
      this.solver.suggestValue(this.sizeData[node.id].height, node.size().height);
      this.solver.suggestValue(this.sizeData[node.id].left, node.position().x);
      this.solver.suggestValue(this.sizeData[node.id].top, node.position().y);
    }
    else if (type === "remove") {
      const removed = this.sizeData[node.id];
      if (removed.parent) {
        const parentId = this.sizeData[node.id].parent.id;
        const parent = this.sizeData[parentId];
        this.solver.removeConstraint(parent.children.data[node.id]);
        delete parent.children.data[node.id];
        this.updateParent(parentId);

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

      delete this.sizeData[node.id];
      delete this.computedSize[node.id];
    }
    changedIds = [...changedIds, ...this.propogateUpdates(this.getRoot(node.id))];
    this.solver.updateVariables();
    for (const id of changedIds) {
      const sizes = this.sizeData[id];
      if (!sizes) { // node deleted
        continue;
      }
      this.computedSize[id] = {
        width: sizes.width.value(),
        height: sizes.height.value(),
        top: sizes.top.value(),
        left: sizes.left.value(),
      };
    }
  },
  propogateUpdates(rootId: string) {
    let changedIds: any = new Set([rootId]);
    const current = this.sizeData[rootId];
    if (!current) {
      return changedIds;
    }
    for (const childId of Object.keys(current.children.data)) {
      changedIds = [...changedIds, ...this.propogateUpdates(childId)];
    }
    return changedIds;
  },
  getRoot(id: string) {
    let current = this.sizeData[id];
    let cId = id;
    if (!current) {
      return cId;
    }
    while (current.parent) {
      cId = current.parent.id;
      current = this.sizeData[cId];
    }
    return cId;
  },
  addNode(node: Node) {
    if (!this.sizeData[node.id]) {
      this.sizeData[node.id] = {
        children: { data: {}, constraint: null },
        parent: null,
        top: new kiwi.Variable(),
        left: new kiwi.Variable(),
        width: new kiwi.Variable(),
        height: new kiwi.Variable(),
        padding: null,
        constraints: [],
      };
      const n = this.sizeData[node.id];

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
      this.computedSize[node.id] = {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      };
    }
  },
  updateParent(parentId: string) {
    const parent = this.sizeData[parentId]
    if (parent.children.constraint) {
      this.solver.removeConstraint(parent.children.constraint);
      parent.children.constraint = null;
    }
    if (Object.keys(parent.children.data).length !== 0) {
      let parentSize = new kiwi.Expression(parent.padding.top);
      let offset = new kiwi.Expression(parent.top, parent.padding.top);
      for (const childId in parent.children.data) {
        const child = this.sizeData[childId];
        if (parent.children.data[childId]) {
          this.solver.removeConstraint(parent.children.data[childId]);
        }
        const childOffset = new kiwi.Constraint(child.top, kiwi.Operator.Eq, offset, kiwi.Strength.required);
        parent.children.data[childId] = childOffset;
        this.solver.addConstraint(childOffset);
        offset = new kiwi.Expression(child.top, child.height);
        parentSize = parentSize.plus(child.height);
      }
      parent.children.constraint = new kiwi.Constraint(parentSize.plus(parent.padding.bottom), kiwi.Operator.Eq, parent.height, kiwi.Strength.required);
      this.solver.addConstraint(parent.children.constraint);
    }
  },
});

export const layoutStoreAnnot = {
  solver: observable.ref,
  sizeData: observable,
  computedSize: observable,
  sizeCalc: action,
  propogateUpdates: action,
  getRoot: action,
  addNode: action,
  updateParent: action,
}