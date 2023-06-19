import { DataNode, EventDataNode } from "antd/es/tree";

export interface TreeDataSelector {
    value: string,
    title: string,
    children: TreeDataSelector[]
}

export interface FetchedTreeData {
    name: string,
    files: string[],
    subDirs: FetchedTreeData[]
}

export interface TreeType {
    title: string;
    isLeaf: boolean;
    key: string;
    children?: TreeType[]
}

export type CustomNode = EventDataNode<DataNode> & { value: string; location: string }