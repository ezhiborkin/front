import { useEffect, useState } from "react"
import { Table, Button, Space } from "antd"
import Link from "next/link"
import { FileWithKey, File } from "@/types/fileManager"
import { Cookies, useCookies } from "react-cookie"
import fileDownload from 'js-file-download'

const Files = () => {
    const [files, setFiles] = useState<FileWithKey[]>([])

    const handleDownload = async(title: string) => {
        const link = `http://localhost:8000/admin/${title}` 
        const res = await fetch(link,{
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include",
        })
        const fileData = await res.blob()
        fileDownload(fileData, title)
    }

    const fetchData = async() => {
        const res = await fetch("http://localhost:8000/get/getnames", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
        });
        const data = await res.json()
        const tableData: FileWithKey[] = data.map((file: File, index: number) => {
            return { key: file.id, index: index + 1, ...file }
        })
        setFiles(tableData)
    }

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Name",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Action",
            key: "action",
            render: ({title}: FileWithKey) => (
                <Space size="middle">
                    {/* {role === "2" || role === "1" ? (
                    <>
                    <Button onClick={() => {handleDownload(title)}}  type="primary">
                        Download
                        </Button>
                    </>) : ( 
                      <>
                      <Button disabled type="primary">
                          Downloads
                          </Button>
                      </>  
                    )} */}
                    <>
                    <Button onClick={() => {handleDownload(title)}}  type="primary">
                        Download
                        </Button>
                    </>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchData()
    },[])

    return (
        <div className="files__wrapper">
            <div className="files-title">Files</div>
            {/* {role === "1" || role === "2" || role === "3" ? ( */}
                <Table dataSource={files} columns={columns} /> 
            {/* ) : ( 
                <Table columns={columns} /> 
            )} */}
        </div>
    )
}

export default Files