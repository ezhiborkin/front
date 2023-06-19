import { Role, RoleWithKey } from "@/types/roleType"
import { useEffect, useState } from "react"
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Table, Button, Space, Modal } from "antd"
import Link from "next/link"

const { confirm } = Modal;

const Roles = () => {
    const [roles, setRoles] = useState<RoleWithKey[]>([])

    const fetchData = async() => {
        const res = await fetch("http://localhost:8080/admin/roles", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include"
        });
        const data = await res.json()
        const tableData: RoleWithKey[] = data.map((role: Role, index: number) => {
            return { key: role.id, index: index + 1, ...role }
        })
        setRoles(tableData)
    }

    useEffect(() => {
        fetchData()
    },[])

    const showConfirm = (id: number) => {
        confirm({
          title: 'Вы действительно хотите удалить эту роль?',
          icon: <ExclamationCircleFilled />,
          content: '',
          onOk() {
            roleRemove(id)
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    };

    const roleRemove = async (id: number) => {
        await fetch(`http://localhost:8080/admin/rolesadm/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
            credentials: "include"
        });
        fetchData()
    };

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Название роли",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Действие",
            key: "action",
            render: ({id, title}: RoleWithKey) => (
                <Space size="middle">
                    {id !== 1 && (
                    <>
                    <Button onClick={() => {
                        showConfirm(id)
                    }}>
                       Delete
                    </Button>
                    </>)}
                </Space>
            ),
        },
    ];

    return (
        <div className="roles__wrapper">
            <div className="roles-title">Роли</div>
            <Table dataSource={roles} columns={columns} /> 
            <Button type="primary">
                <Link href="/roles/newRole">Добавить новую роль</Link>
            </Button>  
        </div>
    )
}

export default Roles