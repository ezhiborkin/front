import { ReactNode } from "react"
import { Head } from "./header"
import { Layout } from "antd"

const { Header, Footer, Content } = Layout;

const LayoutComponent = ({children}: {children: ReactNode | ReactNode[] }): JSX.Element => {
    return(
        <>
            <main>
                <Layout>
                    <Header style = {{ position: 'fixed', top: 0, zIndex: 1000, width: '100%'}}>
                        <Head/>
                    </Header>
                    <Content style={{minHeight: '1000px'}}>
                        {children}
                    </Content>
                    <Footer style={{ position: 'sticky', bottom: 0, zIndex: 1, width: '100%', border: 'dashed red'}}>
                        Footerok
                    </Footer>
                </Layout>
            </main>
        </>        
    )
}

export { LayoutComponent as Layout }; 