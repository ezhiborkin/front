import { Button, Form, message } from "antd"
import UserForm from "./form"
import { FinishUser } from "@/types/finishedUser"
import { useEffect, useState } from "react"
import { UserT } from "@/types/notFinishedUser"

const UpdateUser = () => {

    const [form] = Form.useForm()
    const [userId, setUserId] = useState<string | undefined>()
    const [user, setUser] = useState<UserT>()

    const onFinish = async (values: FinishUser) => {
        const res = await fetch(`http://localhost:8080/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(values),
            credentials: "include"
        });
        if (!res.ok) {
            message.error("err")
        } 
    }

    useEffect(() => {
        const id = window.location.pathname.split("/").at(-1)
        setUserId(id)
        const fetchData = async() => {
            const res = await fetch(`http://localhost:8080/admin/userfind/${id}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
                credentials: "include"
            });
            const data = await res.json() as UserT
            setUser(data)
        }
        fetchData()
},[])

    useEffect(() => {
        user && form.setFields([
            {
                name: "email",
                value: user.email
            },
            {
                name: "title",
                value: user.role_title
            },
            {
                name: "id",
                value: user.id
            }
        ])
    },[user])
        
    return(
        <>
        <div>
            <UserForm form={form} onFinish={onFinish} />
        </div>
        </>
    )
}

export default UpdateUser