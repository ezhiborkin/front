import { Button, message, Space, TreeSelect, Upload, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useEffect, useState } from 'react';
import { FetchedTreeData } from '@/types/filemanagerR';
import { TreeNode } from 'antd/lib/tree-select';
import { filemanager } from '@/global';
import { MyToken } from '@/types/MyToken';
import { Cookies, useCookies } from "react-cookie"
import jwtDecode from 'jwt-decode';

const { Dragger } = Upload;

const UFile = (): JSX.Element => {
    const [files, setFiles] = useState<UploadFile<any>[]>([])
    const [treeData, setTreeData] = useState<FetchedTreeData[]>([])
    const [value, setValue] = useState<string>();
    const [decode, setDecode] = useState<MyToken>({role_id: "", email: "", exp: 0})
    const [token, setToken] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${filemanager}/static`, {
                credentials: 'include'
            })
            const data = await res.json() as FetchedTreeData[]
            setTreeData(data)
        }
        fetchData()
    }, [])

    const handleUploadFiles = async () => {
        if (!value) {
            message.info("Выберите дирректорию для загрузки")
        }
        if (!files) {
            message.info("Выберите файлы для загрузки")
        }

        const formData = new FormData();

        files.forEach(({ originFileObj }) => {
            originFileObj && formData.append('file', originFileObj)
        })
        if (value) {
            formData.append('dir', value)
        }

        const res = await fetch(
            `${filemanager}/file/upload`,
            {
                body: formData,
                method: 'POST',
                credentials: 'include'
            }
        )
        if (res.ok) {
            message.success("Файлы")
            setFiles([])
        }
    }

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info) {
            setFiles(info.fileList)
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload: (file) => {
            const ruSymbols = new RegExp('[а-яА-ЯеЕёЁ]')
            const test = file.name.match(ruSymbols) ? true : false;
            if (test) {
                message.error(`Файл "${file.name}" имеет русские символы в названии`)
            }
            return !test || Upload.LIST_IGNORE;
        },
        maxCount: 10,
        fileList: files
    };

    const onChange = (newValue: string) => {
        setValue(newValue);
    };

    const treeNode = (
        { name, subDirs }: FetchedTreeData,
        parentValue: string | null,
    ) => {
        const value = parentValue ? `${parentValue}/${name}` : name;

        return (
            <>
                <TreeNode key={value} value={value} title={name}>
                    {subDirs.length > 0
                        ? subDirs.map((element) => treeNode(element, value))
                        : null}
                </TreeNode>
            </>
        )
    }

    return (
        <>
            <div className="upload__wrapper">
                <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    value={value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="Выберите директорию"
                    allowClear
                    treeDefaultExpandAll
                    onChange={onChange}
                >
                    {treeData && treeData.map((element) => treeNode(element, null))}
                </TreeSelect>
                <div className='upload-table'>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Нажмите или перенесите файл в это поле для загрузки</p>
                        <p className="ant-upload-hint">
                            Файлы должны быть не больше 1 гб и иметь в имени только латиницу, цифры и спец. символы (-, _)
                        </p>
                    </Dragger>
                    <Button onClick={handleUploadFiles} style={{ marginTop: '10px' }}>Загрузить</Button>
                </div>

            </div>
        </>
    )
}

export { UFile }