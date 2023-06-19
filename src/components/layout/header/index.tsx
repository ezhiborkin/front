import { Button, Menu } from "antd";
import Link from "next/link";
import { Cookies, useCookies } from "react-cookie"
import { use, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { MyToken } from "@/types/MyToken";

const Header = () => {
    const cookies = new Cookies();

    // console.log(jwtDecode<MyToken>(cookies.get("token")))

    const [decode, setDecode] = useState<MyToken>({role_id: "", email: "", exp: 0})
    useEffect(() => {
        if(cookies.get("token") && cookies.get("token") != "") {
            setDecode(jwtDecode<MyToken>(cookies.get("token")))
        }
    }, [])

    const [token, setToken] = useState<string>('')
    useEffect(() => {
        if (cookies.get("token") && cookies.get("token") != ''){
            setToken(cookies.get("token"))
        }
    }, [token])
    
    const handleLogOut = () => {
        if (cookies.get("token")) {
            cookies.remove("token")
        }
        decode.role_id = ""
    }
    
    const navItems = [
        {
            key: 1,
            label: <Link href="/">Главная</Link>,
            
        },
        {
            key: 2,
            label: <Link href="/roles">Роли</Link>,
        },
        {
            key: 3,
            label: <Link href="/users">Пользователи</Link>
        },
        {
            key: 4,
            label: <Link href="/files">Файлы</Link>
        },
        {
            key: 5,
            label: <Link href="/perms">Разрешения</Link>
        }
    ]

    const authorizedItems = [
        {
            key: 1,
            label: <Link href="/">Главная</Link>
        },
        {
            key: 2,
            label: <Link href="/files">Файлы</Link>
        }
    ]

    const unauthorizedItems = [
        {
            key: 1,
            label: <Link href="/">Главная</Link>
        },
        {
            key: 2,
            label: <Link href="/">Policy</Link>
        }
    ]

    return(
        <>
            <div className="logo" />
            <div style={{display: "flex", justifyContent: "space-between"}}>
                {decode.role_id && decode.role_id === "1" && (
                    <>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            disabledOverflow={true}
                            items={navItems}
                        />
                    </>
                )}
                {!decode.role_id && (
                    <>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        disabledOverflow={true}
                        items={unauthorizedItems}
                    />
                    </>
                )}
                {decode.role_id && decode.role_id === "2" && (
                    <>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            disabledOverflow={true}
                            items={authorizedItems}
                        />
                    </>
                )}
                     
                    

                <div>
                    {decode.role_id === "" ? (<Link color="#fff" href="/register">Регистрация</Link>) : (<span style={{color: "#fff"}}>Привет {decode.email}!</span>)}
                      <span style={{marginLeft: "16px"}}>
                        {decode.role_id === "" ? (<Link href="/login">Войти</Link>) : (<Link color="#fff" href="/" onClick={() => handleLogOut()}>Выйти</Link>)}
                    </span>
                </div>
                {/* <Menu 
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={authItems}
                /> */}
                
            </div>
        </>

    )
}

export { Header as Head }

