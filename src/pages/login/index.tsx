import { LoginUser } from "@/types/loginUser";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from "antd"

const Login = () => {
    const [form] = Form.useForm()
    // const redir = window.location.href = "/"
    const loginUser = async (body: LoginUser) => {
        await fetch("http://localhost:8080/login", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
    };

    const onFinish = (values: any) => { 
        const body = {email: form.getFieldValue("email"), password: form.getFieldValue("password")}
        // console.log(body)
        loginUser(body)
        window.location.href = "/"
    };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
        <div className="login__base">Авторизация</div>
        <div className="login__wrapper">
            <Form
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            >
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your E-mail!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Пароль"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Запомнить меня</Checkbox>
                </Form.Item>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                Войти
                </Button>
                Или <a href="">зарегистрироваться!</a>
            </Form.Item>
            </Form>
        </div>
        </>
    )
}

export default Login