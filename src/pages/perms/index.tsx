import { Repo, RepoWithKey } from "@/types/repos"
import { Button, Space, Table, Modal } from "antd"
import Link from "next/link"
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react"
import { Cookies, useCookies } from "react-cookie"

const Perms = () => {
    const [repos, setRepos] = useState<RepoWithKey[]>([])

    const fetchData = async() => {
        const res = await fetch("http://localhost:8081/rep/get", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include"
        });
        const data = await res.json()
        const tableData: RepoWithKey[] = data.map((repo: Repo, index: number) => {
            return { key: repo.id, index: index + 1, ...repo }
        })
        tableData.sort((a, b) => a.id > b.id ? 1 : -1)
        setRepos(tableData)
    }

    const columns = [
        {
            title: "№",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Название репозитория",
            dataIndex: "repo",
            key: "repo"
        },
        {
            title: "Действие",
            key: "action",
            render: ({repo}: RepoWithKey) => (
                <Space size="middle">
                    <Button type="primary">
                        <Link href={`/perms/edit/${repo}`}>Изменить права доступа</Link>
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchData()
    },[])

    return (
        <div className="perms__wrapper">
            <div className="perms-title">Репозитории</div>
            <Table dataSource={repos} columns={columns} />   
            {/* <Button type="primary">
                <Link href="/users/newuser">Add new User</Link>
            </Button>            */}
        </div>
    )
}


export default Perms