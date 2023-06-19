import { RegisterUser } from '@/types/registerUser';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';

const Register = () => {
    const [form] = Form.useForm()
    const registerUser = async (body: RegisterUser) => {
        await fetch("http://localhost:8080/userscreate", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
    };

    const onFinish = (values: any) => { 
        const body = {email: form.getFieldValue("email"), password: form.getFieldValue("password")}
        // console.log(body)
        registerUser(body)
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

    return (
    <>   
    <div className="register__base">Регистрация</div>
    <div className="register__wrapper">
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
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
            </Form.Item>
        
            <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Пароль" />
            </Form.Item>
        
            <Form.Item name="agreement" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }} 
            rules={[
                {
                  required: true,
                  message: "Please accept the terms & conditions",
                },
              ]}
            >
            <Checkbox>Я согласен на обработку персональных данных</Checkbox>
            </Form.Item>
        
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" className="register-form-button">
                Зарегистрироваться
            </Button>
            </Form.Item>
        </Form>
    </div>
    </> 
    )
}

export default Register