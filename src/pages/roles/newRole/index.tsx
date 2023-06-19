import { RoleAdd } from "@/types/roleAdm";
import { Button, Form, Input } from "antd";

const NewRole = () => {
    const [form] = Form.useForm()
    const roleAddAdm = async (body: RoleAdd) => {
        await fetch("http://localhost:8080/roles", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
    };

    const onFinish = (values: any) => { 
        const body = {
            title: form.getFieldValue("title"), 
        }
        roleAddAdm(body)
    };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return(
    <div className="role__wrapper">
        <div className="role__new">Добавление новой роли</div>
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {/* MAYBE ADD A CHECK IF THE ROLES EXISTS ALREADY */}
            <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: 'Please input new title!' }]}
            >
            <Input />
            </Form.Item>
        
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Добавить
            </Button>
            </Form.Item>
        </Form>
    </div>
    )
}

export default NewRole