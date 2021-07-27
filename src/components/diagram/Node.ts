import { Cell, Node, Interp, ObjectExt } from '@antv/x6';
import { ReactShape } from '@antv/x6-react-shape';

export class ExtNode extends ReactShape {
  translate(tx = 0, ty = 0, options: Node.TranslateOptions = {}) {
    const selectedNodes = this.model?.graph?.getSelectedCells();

    if (this.checkTranslationOwner(options.translateBy) && options.parentCall !== (this.getParent() as Node).id) {
      return this;
    }
    if (tx === 0 && ty === 0) {
      return this;
    }
    if (this.store.get().movable === false && !options.parentCall) {
      if (this._parent) {
        this._parent.translate(tx, ty, options);
      }
      return this;
    }

    options.translateBy = options.translateBy || this.id;

    const position = this.getPosition();

    if (options.restrict != null && options.translateBy === this.id) {
      const bbox = this.getBBox({ deep: true });
      const ra = options.restrict;
      const dx = position.x - bbox.x;
      const dy = position.y - bbox.y;
      const x = Math.max(ra.x + dx, Math.min(ra.x + ra.width + dx - bbox.width, position.x + tx));
      const y = Math.max(ra.y + dy, Math.min(ra.y + ra.height + dy - bbox.height, position.y + ty));

      tx = x - position.x;
      ty = y - position.y;
    }

    const translatedPosition = {
      x: position.x + tx,
      y: position.y + ty,
    };

    options.tx = tx;
    options.ty = ty;

    if (options.transition) {
      if (typeof options.transition !== 'object') {
        options.transition = {};
      }

      this.transition('position', translatedPosition, {
        ...options.transition,
        interp: Interp.object,
      });
      const newOptions = { ...options, parentCall: true };
      this.eachChild((child) => {
        if (selectedNodes?.indexOf(child) === -1) {
          child.translate(tx, ty, newOptions);
        }
      });
    } else {
      this.startBatch('translate', options);
      this.store.set('position', translatedPosition, options);
      options.handledTranslation = options.handledTranslation || [];
      if (!options.handledTranslation.includes(this)) {
        options.handledTranslation.push(this);
        const children = this._children;
        if (children?.length) {
          options.handledTranslation.push(...children);
        }
      }
      const newOptions = { ...options, parentCall: this.id };
      this.eachChild((child) => {
        child.translate(tx, ty, newOptions);
      });
      this.stopBatch('translate', options);
    }

    return this;
  }
  getStore() {
    return this.store;
  }
  checkTranslationOwner(ownerId: string | number | undefined): boolean {
    let child = this as Node;
    while (child.getParent()) {
      if ((child.getParent() as Node).id === ownerId) {
        return true;
      }
      child = child.getParent() as Node;
    }
    return false;
  }
  eachChild(iterator: (child: Cell, index: number, children: Cell[]) => void, context?: any) {
    (this._children || []).forEach(iterator, context);
    return this;
  }
  getChildCount() {
    return this._children?.length || 0;
  }
  insertChild(child: Cell | null, index?: number, options: Cell.SetOptions = {}): this {
    if (child != null && child !== this) {
      const oldParent = child.getParent();
      const changed = this !== oldParent;

      let pos = index;
      if (pos == null) {
        pos = this.getChildCount();
        if (!changed) {
          pos -= 1;
        }
      }

      // remove from old parent
      if (oldParent) {
        const children = oldParent.getChildren();
        if (children) {
          const index = children.indexOf(child);
          if (index >= 0) {
            child.setParent(null, options);
            children.splice(index, 1);
            oldParent.setChildren(children, options);
          }
        }
      }
      let children = this._children;
      if (children == null) {
        children = [];
        children.push(child);
      } else {
        children.splice(pos, 0, child);
      }

      child.setParent(this, options);
      this.setChildren(children, options);

      if (changed && this.model) {
        const incomings = this.model.getIncomingEdges(this);
        const outgoings = this.model.getOutgoingEdges(this);

        if (incomings) {
          incomings.forEach((edge) => edge.updateParent(options));
        }

        if (outgoings) {
          outgoings.forEach((edge) => edge.updateParent(options));
        }
      }

      if (this.model) {
        this.model.addCell(child, options);
      }
    }

    return this;
  }
  toJSON(options: Cell.ToJSONOptions = {}): Node.Properties {
    const props = { ...this.store.get() };
    const toString = Object.prototype.toString;
    const cellType = 'node';

    if (!props.shape) {
      const ctor = this.constructor;
      throw new Error(
        `Unable to serialize ${cellType} missing "shape" prop, check the ${cellType} "${
          ctor.name || toString.call(ctor)
        }"`,
      );
    }

    const ctor = this.constructor as typeof Cell;
    const diff = options.diff === true;
    const attrs = props.attrs || {};
    const presets = ctor.getDefaults(true) as Node.Properties;
    // When `options.diff` is `true`, we should process the custom options,
    // such as `width`, `height` etc. to ensure the comparing work correctly.
    const defaults = diff ? this.preprocess(presets, true) : presets;
    const defaultAttrs = defaults.attrs || {};
    const finalAttrs: any = {};

    Object.keys(props).forEach((key) => {
      if (key !== 'yogaProps') {
        const val = props[key];
        if (val != null && !Array.isArray(val) && typeof val === 'object' && !ObjectExt.isPlainObject(val)) {
          throw new Error(
            `Can only serialize ${cellType} with plain-object props, but got a "${toString.call(
              val,
            )}" type of key "${key}" on ${cellType} "${this.id}"`,
          );
        }

        if (key !== 'attrs' && key !== 'shape' && diff) {
          const preset = defaults[key];
          if (ObjectExt.isEqual(val, preset)) {
            delete props[key];
          }
        }
      } else {
        delete props[key];
      }
    });

    Object.keys(attrs).forEach((key) => {
      const attr = attrs[key];
      const defaultAttr = defaultAttrs[key];

      Object.keys(attr).forEach((name) => {
        const value = attr[name] as any;
        const defaultValue = defaultAttr ? defaultAttr[name] : null;

        if (value != null && typeof value === 'object' && !Array.isArray(value)) {
          Object.keys(value).forEach((subName) => {
            const subValue = value[subName];
            if (
              defaultAttr == null ||
              defaultValue == null ||
              !ObjectExt.isObject(defaultValue) ||
              !ObjectExt.isEqual(defaultValue[subName], subValue)
            ) {
              if (finalAttrs[key] == null) {
                finalAttrs[key] = {};
              }
              if (finalAttrs[key][name] == null) {
                finalAttrs[key][name] = {};
              }
              const tmp = finalAttrs[key][name] as any;
              tmp[subName] = subValue;
            }
          });
        } else if (defaultAttr == null || !ObjectExt.isEqual(defaultValue, value)) {
          // `value` is not an object, default attribute with `key` does not
          // exist or it is different than the attribute value set on the cell.
          if (finalAttrs[key] == null) {
            finalAttrs[key] = {};
          }
          finalAttrs[key][name] = value as any;
        }
      });
    });

    const finalProps = {
      ...props,
      attrs: ObjectExt.isEmpty(finalAttrs) ? undefined : finalAttrs,
    };

    if (finalProps.attrs == null) {
      delete finalProps.attrs;
    }

    const ret = finalProps as any;
    if (ret.angle === 0) {
      delete ret.angle;
    }

    return ObjectExt.cloneDeep(ret);
  }
}
