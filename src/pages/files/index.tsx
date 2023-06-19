import { Button, Divider, Radio, RadioChangeEvent, Space } from "antd"
import { useEffect, useState } from "react"
import { UFile } from "../../components/filemanager/uploadFile"
import { ChangeFile } from "../../components/filemanager/changeFile"
// import { filemanager } from "@/global"
import Image from 'next/image';

const Filemanger = () => {
    const [page, setPage] = useState('upload')

    const handlePage = (e: RadioChangeEvent) => {
        setPage(e.target.value)
    }

    return (
        <div className="filemanager__wrapper">
            <span style={{ paddingRight: '12px' }} className="filemanager-title">Файловый менеджер</span>

            <Radio.Group value={page} onChange={handlePage}>
                <Radio.Button value="upload">Загрузить</Radio.Button>
                <Radio.Button value="change">Изменить</Radio.Button>
            </Radio.Group>
            {page === "upload" ? <UFile /> : <ChangeFile />}
        </div>
    )
}

export default Filemanger