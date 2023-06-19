import { FinishUser } from "@/types/finishedUser"
import { Role } from "@/types/roleType"
import { TreeValuesRoles } from "@/types/treeValuesRoles"
import { Form, FormInstance, Input, Space, TreeSelect, Button } from "antd"
import { useEffect, useState } from "react"

const {Item} = Form

const UserForm = (
    {form, onFinish}: 
    {form: FormInstance<any>, onFinish: (values: FinishUser) => Promise<void>}):JSX.Element => {
    const [roles, setRoles] = useState<TreeValuesRoles[]>()
    useEffect(() => {
        const fetchData = async() => {
            const res = await fetch(`http://localhost:8080/admin/roles`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
                credentials: "include"
            });
            const data = await res.json() as Role[]

            const treeData: TreeValuesRoles[] = data.map((value) => {
                return {title: value.title, value: value.id.toString()}
            })
            setRoles(treeData)
        }
        fetchData()
    },[])


    return(
        <>
        <div style={{paddingTop: 15, paddingLeft: 20}}>
            <Form onFinish={onFinish} form={form}>
                <Item style={{width: 200}} name="id">
                    <Input disabled placeholder="123"/>
                </Item>
                <Item style={{width: 200}} name="email">
                    <Input disabled placeholder="email"/>
                </Item>
                <Item style={{width: 200}} name="role_title">
                    <TreeSelect treeData={roles} placeholder="123"/>
                </Item>
            </Form>
            <Space> 
                <Button onClick={() => form.submit()}>Сохранить</Button>
            </Space>
        </div>
        
        </>
    )

}

export default UserForm