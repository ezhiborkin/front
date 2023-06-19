import { RegisterUserAdm } from "@/types/registerUserAdm";
import { Button, Form, Input } from "antd"

const NewUser = () => {
    const [form] = Form.useForm()
    const registerUserAdm = async (body: RegisterUserAdm) => {
        await fetch("http://localhost:8080/admin/usersadm", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
    };

    const onFinish = (values: any) => { 
        const body = {
            email: form.getFieldValue("email"), 
            password: form.getFieldValue("password"), 
            role_id: parseInt(form.getFieldValue("role_id"))
        }
        console.log(body)
        registerUserAdm(body)
    };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return(
    <div className="newuser__wrapper">
        <div className="newuser-title">Add a user</div>
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
            <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
            >
            <Input />
            </Form.Item>
        
            <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item
            label="Role ID"
            name="role_id"
            rules={[{ required: true, message: 'Please input your role!' }]}
            >
            <Input />
            </Form.Item>
        
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
        </Form>
    </div>
    )
}

export default NewUser