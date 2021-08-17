import { HistoryManager } from '@antv/x6/lib/graph/history';
import { ObjectExt, Node } from '@antv/x6';
import { cloneDeep } from 'lodash';

export interface KeyValue<T extends any = any> {
  [key: string]: T;
}

export class FixedHistory extends HistoryManager {
  protected applyCommand(cmd: HistoryManager.Commands, options?: KeyValue) {
    this.freezed = true;

    const cmds = Array.isArray(cmd) ? this.sortBatchCommands(cmd) : [cmd];
    for (let i = 0; i < cmds.length; i += 1) {
      const cmd = cmds[i];
      const localOptions = {
        ...options,
        ...ObjectExt.pick(cmd.options, this.options.applyOptionsList || []),
      };
      this.executeCommand(cmd, false, localOptions);
    }

    this.freezed = false;
  }
  protected revertCommand(cmd: HistoryManager.Commands, options?: KeyValue) {
    this.freezed = true;

    const cmds = Array.isArray(cmd) ? this.sortBatchCommands(cmd) : [cmd];
    for (let i = cmds.length - 1; i >= 0; i -= 1) {
      const cmd = cmds[i];
      const localOptions = {
        ...options,
        ...ObjectExt.pick(cmd.options, this.options.revertOptionsList || []),
      };
      this.executeCommand(cmd, true, localOptions);
    }

    this.freezed = false;
  }
  protected createComplexAddEvent(node: any, cmds: HistoryManager.Command[]) {
    const parentNode = Node.isNode(node) ? node : Node.create(node);
    (node.children || []).forEach((e: string) => {
      const childCmd = cmds.filter((cmd: HistoryManager.Command) => this.isAddEvent(cmd.event) && cmd.data.id === e)[0];
      if (childCmd) {
        const child = this.createComplexAddEvent((childCmd.data as any).props, cmds);
        parentNode.addChild(child);
      }
    });
    return parentNode;
  }
  protected sortBatchCommands(cmds: HistoryManager.Command[]) {
    let results: HistoryManager.Command[] = [];
    const complexAddEvent: string[] = [];
    for (let i = 0, ii = cmds.length; i < ii; i += 1) {
      const cmd = cloneDeep(cmds[i]);
      let index: number | null = null;

      if (this.isAddEvent(cmd.event)) {
        const id = cmd.data.id;
        for (let j = 0; j < i; j += 1) {
          if (cmds[j].data.id === id) {
            index = j;
            break;
          }
        }
        const props = (cmd.data as any).props;
        if (!props.parent) {
          const parentNode = this.createComplexAddEvent(props, cmds);
          (cmd.data as any).props = parentNode;
          complexAddEvent.push(cmd.data.id || '');
        }
      }
      if (cmd.event === 'cell:change:children') {
        for (let j = 0; j < i; j += 1) {
          if (
            cmds[j].event === 'cell:change:parent' &&
            (cmd.data as any).prev.children.indexOf(cmds[j].data.id) !== -1
          ) {
            index = j;
            break;
          }
        }
      }
      if (index !== null) {
        results.splice(index, 0, cmd);
      } else {
        results.push(cmd);
      }
    }
    results = results.filter(
      (cmd: HistoryManager.Command) => !this.isAddEvent(cmd.event) || complexAddEvent.indexOf(cmd.data.id || '') !== -1,
    );
    return results;
  }
  protected isAddEvent(event?: HistoryManager.ModelEvents) {
    return event === 'cell:added';
  }
  protected isRemoveEvent(event?: HistoryManager.ModelEvents) {
    return event === 'cell:removed';
  }
}
