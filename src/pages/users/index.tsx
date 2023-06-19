import { User, UserWithKey } from "@/types/usersType"
import { Button, Space, Table, Modal } from "antd"
import Link from "next/link"
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react"
import { Cookies, useCookies } from "react-cookie"

const { confirm } = Modal;

const Users = (    ) => {
    const cookies = new Cookies();
    const [role, setRole] = useState<string>('')
    useEffect(() => {
        if (cookies.get("role") && cookies.get("role") != ''){
            setRole(cookies.get("role"))
        }
    }, [role])

    const [users, setUsers] = useState<UserWithKey[]>([])
    const userRemove = async (id: number) => {
        await fetch(`http://localhost:8080/admin/usersadm/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include"
        });
        fetchData()
    };

    const showConfirm = (id: number) => {
        confirm({
          title: 'Do you really want to delete this user?',
          icon: <ExclamationCircleFilled />,
          content: '',
          onOk() {
            userRemove(id)
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    };

    const fetchData = async() => {
        const res = await fetch("http://localhost:8080/admin/users", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include"
        });
        const data = await res.json()
        const tableData: UserWithKey[] = data.map((user: User, index: number) => {
            return { key: user.id, index: index + 1, ...user }
        })
        tableData.sort((a, b) => a.id > b.id ? 1 : -1)
        setUsers(tableData)
    }

    const columns = [
        {
            title: "№   ",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Название роли",
            dataIndex: "role_title",
            key: "role_title",
            sorter: ((a: any, b: any) => a.role_title.localeCompare(b.role_title))
        },
        {
            title: "Действие",
            key: "action",
            render: ({id}: UserWithKey) => (
                <Space size="middle">
                    <Button type="primary">
                        <Link href={`/users/edit/${id}`}>Edit</Link>
                    </Button>
                    <Button onClick={() => {
                        showConfirm(id);
                    }}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchData()
    },[])

    return (
        <div className="users__wrapper">
            <div className="users-title">Пользователи</div>
            <Table dataSource={users} columns={columns} />   
            <Button type="primary">
                <Link href="/users/newuser">Добавить нового пользователя</Link>
            </Button>           
        </div>
    )
}


export default Users