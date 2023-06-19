import { Button, DividerProps, Input, Modal, Tree } from "antd"
import { useEffect, useState } from "react"
import { CustomNode, FetchedTreeData, TreeType } from '@/types/filemanagerR';
import { TreeNode } from "antd/lib/tree-select";
import { filemanager, backend } from "@/global";
import { redirect } from "next/dist/server/api-utils";
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { MyToken } from "@/types/MyToken";
import jwtDecode from "jwt-decode";
import { Cookies, useCookies } from "react-cookie"

const FileAction = (
    { info, fetchData, handleClickDel }:
        {
            info: CustomNode,
            fetchData: () => Promise<void>,
            handleClickDel: (value: string) => void
        }) => {
    const [inputValue, setInputValue] = useState<string>(info.title as string)
    useEffect(() => {
        setInputValue(info.title as string)
    }, [info])

    const handleRename = async () => {
        const body = {
            old: info.value,
            new: info.value.slice(0, info.value.length - (info.title as string).length) + "/" + inputValue
        }
        const res = await fetch(`${filemanager}/file/rename`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body)
        })
        fetchData()
    }

    return (
        <>
            <div className="action__wrapper">
                <Input
                    value={inputValue}
                    onChange={({ target: { value } }) => setInputValue(value)}
                    placeholder="file.png"
                    style={{ marginBottom: '20px' }}
                />

                {/* <CopyToClipboard
                    text={`${filemanager}/static/${info.value}`}
                >
                </CopyToClipboard> */}
                <Button href={`${filemanager}/static/${info.value}`}>Скачать</Button>
                <Button onClick={() => handleRename()}>Изменить</Button>
                <Button
                    onClick={() => handleClickDel(info.value)}
                >
                    Удалить
                </Button>
            </div>
        </>
    )
}

const FolderAction = (
    { info, fetchData, handleClickDel, setFolderName, setShowModalDir, setFolderLocation }:
        {
            info: CustomNode,
            fetchData: () => Promise<void>,
            handleClickDel: (value: string) => void,
            setFolderName: React.Dispatch<React.SetStateAction<string>>,
            setShowModalDir: React.Dispatch<React.SetStateAction<boolean>>,
            setFolderLocation: React.Dispatch<React.SetStateAction<string>>
        }
) => {
    const [inputValue, setInputValue] = useState<string>(info.title as string)
    useEffect(() => {
        setInputValue(info.title as string)
    }, [info])

    const handleRenameDir = async () => {
        const body = {
            old: info.value,
            new: info.value.slice(0, info.value.length - (info.title as string).length) + inputValue
        }

        const res = await fetch(`${filemanager}/dir/rename`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body)
        })
        fetchData()
    }

    const handleFolderLocation = (path: string): string => {
        const split = path.split('/')
        if (split.length > 1) {
            path = split.slice(0, split.length - 1).join('/')
            return path
        } else {
            return path
        }
    }

    return (
        <>
            <div className="action__wrapper">
                <Input
                    value={inputValue}
                    onChange={({ target: { value } }) => setInputValue(value)}
                    placeholder="file.png"
                    style={{ marginBottom: '20px' }}
                />
                <Button onClick={
                    () => {
                        setFolderLocation(info.value)
                        setShowModalDir(true)
                    }
                }>Создать директорию</Button>
                {/* <Button onClick={() => handleRenameDir()}>Изменить</Button> */}
                <Button
                    onClick={() => handleClickDel(info.value)}
                >
                    Удалить
                </Button>
            </div>
        </>
    )
}

const ChangeFile = () => {
    const [treeData, setTreeData] = useState<TreeType[]>([])
    const [selected, setSelected] = useState<CustomNode>()
    const [folderLocation, setFolderLocation] = useState<string>('')
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showModalDir, setShowModalDir] = useState<boolean>(false)
    const [folderName, setFolderName] = useState<string>('')
    const [deleting, setDeleting] = useState<string>('')
    const [showModalDel, setShowModalDel] = useState<boolean>(false)

    const onSelect = (selectedKeys: any, info: any) => {
        setSelected(info.node)
    }
    const fetchData = async () => {
        const res = await fetch(`${filemanager}/static`, {
            credentials: "include"
        })
        const data = await res.json() as FetchedTreeData[]
        setTreeData(treeFormatter(data, null))
    }
    useEffect(() => {
        fetchData()
    }, [])

    const treeFormatter = (
        data: FetchedTreeData[],
        parentValue: string | null
    ): TreeType[] => {

        return data.map(({ name, files, subDirs }) => {
            const trimName = name.trim();
            const value = parentValue ? `${parentValue}/${trimName}` : trimName;
            const formattedFiles = files ? fileFormatter(files, value) : []
            const formattedFolders = treeFormatter(subDirs, value)

            return {
                title: trimName,
                isLeaf: false,
                children: formattedFolders.concat(formattedFiles),
                key: Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 8),
                value: value,
                location: value.slice(0, value.length - trimName.length)
            }
        })

    }

    const fileFormatter = (files: string[], parentValue: string): TreeType[] => {
        return files.map((currentFile) => {
            return {
                title: currentFile.trim(),
                isLeaf: true,
                key: Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 8),
                value: `${parentValue}/${currentFile.trim()}`,
                location: `${parentValue}/${currentFile.trim()}`.slice(
                    0,
                    `${parentValue}/${currentFile.trim()}`.length - currentFile.trim().length,
                )
            }
        })
    }

    const handleCancelCreate = () => {
        setFolderLocation('')
        setShowModal(false)
    }

    const handleCancelCreateDir = () => {
        setFolderLocation('')
        setShowModalDir(false)
    }

    const handleCreate = async () => {
        const body = {
            dir: `${folderLocation ? folderLocation + '/' + folderName : folderName}`
        }
        const res = await fetch(`${filemanager}/rep/create`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body)
        })
        setFolderName('')
        setFolderLocation('')
        setShowModal(false)
        await fetchData();
    }

    const handleCreateDir = async () => {
        const body = {
            dir: `${folderLocation ? folderLocation + '/' + folderName : folderName}`
        }
        const res = await fetch(`${filemanager}/dir/create`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body)
        })
        setFolderName('')
        setFolderLocation('')
        setShowModalDir(false)
        await fetchData();
    }

    const handleClickDel = (value: string) => {
        setDeleting(value)
        setShowModalDel(true)
    }

    const handleRemove = async () => {
        selected && selected.isLeaf ? await fetch(`${filemanager}/file/remove`, {
            method: 'DELETE',
            credentials: 'include',
            body: JSON.stringify({ filename: deleting })
        }) : await fetch(`${filemanager}/dir/remove`, {
            method: 'DELETE',
            credentials: 'include',
            body: JSON.stringify({ dir: deleting })
        })
        setDeleting('')
        setShowModalDel(false)
        setSelected(undefined)
        await fetchData()
    }

    const handleCancelRemove = () => {
        setDeleting('')
        setShowModalDel(false)
    }

    return (
        <>
            <div className="change__wrapper">
                <div className="tree-wrapper">
                    <Button
                        onClick={() => {
                            setFolderLocation('')
                            setShowModal(true)
                        }}
                        style={{ marginBottom: '25px' }}
                    >
                        Создать репозиторий
                    </Button>
                    <Tree
                        showLine
                        onSelect={onSelect}
                        treeData={treeData}
                    >
                    </Tree>

                    <Modal
                        open={showModal}
                        onOk={handleCreate}
                        onCancel={handleCancelCreate}
                    >
                    
                        <span>Создание директории</span>
                        <Input
                            value={folderName}
                            onChange={({ target: { value } }) => setFolderName(value)}
                            style={{ marginTop: '20px' }}
                        />
                    </Modal>
                    <Modal
                        open={showModalDir}
                        onOk={handleCreateDir}
                        onCancel={handleCancelCreateDir}
                    >
                    
                        <span>Создание директории</span>
                        <Input
                            value={folderName}
                            onChange={({ target: { value } }) => setFolderName(value)}
                            style={{ marginTop: '20px' }}
                        />
                    </Modal>
                </div>

                <div className="action-wrapper">
                    {selected && (
                        <>
                            {selected.isLeaf ? (
                                <FileAction info={selected} fetchData={fetchData} handleClickDel={handleClickDel} />
                            ) : <FolderAction info={selected} fetchData={fetchData} handleClickDel={handleClickDel} setFolderLocation={setFolderLocation} setFolderName={setFolderName} setShowModalDir={setShowModalDir} />
                            }
                        </>
                    )}

                    <Modal
                        open={showModalDel}
                        onOk={handleRemove}
                        onCancel={handleCancelRemove}
                    >
                        <span>Вы уверены, что хотите удалить {deleting} ?</span>
                    </Modal>
                </div>
            </div>

        </>
    )
}

export { ChangeFile }