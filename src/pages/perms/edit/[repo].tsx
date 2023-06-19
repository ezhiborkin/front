import { Repo, RepoWithKey } from '@/types/repos';
import { RepoP, RepoPWithKey } from '@/types/repoTotal';
import { RoleWithKey } from '@/types/roleType';
import { v4 as uuidv4 } from 'uuid';
import { Button, Form, Input, InputNumber, Popconfirm, Select, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: RepoPWithKey;
    index: number;
    children: React.ReactNode;
}

interface Role {
  id: number;
  title: string;
}
  
const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
        {editing ? (
            <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
                {
                required: true,
                message: `Please Input ${title}!`,
                },
            ]}
            >
            {inputNode}
            </Form.Item>
        ) : (
            children
        )}
        </td>
    );
};

const Permission = () => {
  const [form] = Form.useForm();
  const [repo, setRepo] = useState<RepoPWithKey[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  const handlePathChange = (value: string) => {
    setSelectedPath(value);
  };
  
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };
  
  const repo_name = window.location.pathname.split("/").at(-1);
  
  const isEditing = (record: RepoPWithKey) => record.key === editingKey;

  const edit = (record: Partial<RepoPWithKey> & { key: React.Key }) => {
    form.setFieldsValue({ Role: '', Path: '', ...record });
    setEditingKey(record.key);
  };

  const deleteRow = (record: RepoPWithKey) => {
    const newData = [...repo];
    const index = newData.findIndex((item) => record.key === item.key);
    if (index > -1) {
      const deletedItem = newData[index]; 

      newData.splice(index, 1);
      setRepo(newData);
      setEditingKey('');

      const body = {
        id: deletedItem.id,
        role_title: deletedItem.role_title,
        path: deletedItem.path,
        permission: deletedItem.permission,
      };
      console.log(body)
      
      const fetchData = async() => {
        const repo = window.location.pathname.split("/").at(-1)
        const res = await fetch(`http://localhost:8081/rep/removeperms/${repo}`, {
          method: 'DELETE',
          headers: {
            "content-type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(body)
        });
      }
      fetchData()
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  // const delete = () => {

  // }
  
  const onSearchInput = (value: string) => {
    console.log('search:', value);
  };


  const handleAdd = () => {
      const role = roles.find(function(role){return role.value === selectedRole})
      const path = options.find(function(option){return option.value === selectedPath})

      const newData: RepoPWithKey = {
        id: parseInt(uuidv4()),
        key: uuidv4(),
        index: parseInt(uuidv4()),
        role_title: role?.label ? role.label : '',
        path: path?.label ? path.label : '',
        permission: inputValue,
      };
      const body = {
        role_title: newData.role_title,
        path: newData.path,
        permission: newData.permission,
      }
      console.log(body)
      const fetchData = async() => {
        const repo = window.location.pathname.split("/").at(-1)
        const res = await fetch(`http://localhost:8081/rep/addperms/${repo}`,{
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(body),
          credentials: "include",
        })
      }
      fetchData()
      setRepo([...repo, newData]);
  };

    useEffect(() => {
      const fetchData = async() => {
          const repo = window.location.pathname.split("/").at(-1)
          const res = await fetch(`http://localhost:8081/rep/getperms/${repo}`, {
              method: "GET",
              headers: {
                  "content-type": "application/json",
              },
              credentials: "include"
          });
          const data = await res.json()
          const tableData: RepoPWithKey[] = data.map((repo: RepoP, index: number) => {
              return { key: String(repo.id), index: index + 1, ...repo }
          })
          setRepo(tableData)
      }    
      fetchData()
    },[]) 

    useEffect(() => {
      fetchOptions();
    }, []);

    useEffect(() => {
      fetchRoles();
    }, []);
    
    const fetchRoles = async () => {
      try {
        const repo = window.location.pathname.split("/").at(-1);
        const res = await fetch(`http://localhost:8080/admin/roles`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        const rolesData = data.map((role: Role) => {
          return {value: role.id, label: role.title,}
        });
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchOptions = async () => {
      try {
        const repo = window.location.pathname.split("/").at(-1);
        const res = await fetch(`http://localhost:8081/rep/getfiles/${repo}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        const optionsData = data.map((path: any) => ({
          value: path.id,
          label: path.path,
        }));
        setOptions(optionsData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
  
    const save = async (key: React.Key) => {
      try {
        const row = (await form.validateFields()) as RepoPWithKey;
  
        const newData = [...repo];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setRepo(newData);
          setEditingKey('');

          const body = {
            id: item.id,
            role_title: row.role_title,
            path: row.path,
            permission: row.permission,
          };

          const fetchData = async () => {
            const repoId = window.location.pathname.split("/").at(-1);
            console.log(body)
            const res = await fetch(`http://localhost:8081/rep/editperms/${repoId}`, {
              method: "PATCH",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(body),
              credentials: "include",
            });
          };
          fetchData();
    
        } else {
          newData.push(row);
          setRepo(newData);
          setEditingKey('');
        }
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };

    const columns = [
        {
          title: 'Роль',
          dataIndex: 'role_title',
          key: 'role_title',
          width: '25%',
          editable: true,
        },
        {
          title: 'Путь',
          dataIndex: 'path',
          key: 'path',
          width: '40%',
          editable: true,
        },
        {
          title: 'Права (---)',
          dataIndex: 'permission',
          key: 'permission',
          width: '15%',
          editable: true,
        },
        {
          title: 'Действие',
          dataIndex: 'operation',
          render: (_: any, record: RepoPWithKey) => {
            const editable = isEditing(record);
            return editable ? (
              <span>
                <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                  Сохранить
                </Typography.Link>
                <Popconfirm title="Уверены что хотите отменить?" onConfirm={cancel}>
                  <a>Отменить</a>
                </Popconfirm>
              </span>
            ) : (
              <>
              <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                Изменить
              </Typography.Link>
              <Typography.Link style={{margin: 10}} disabled={editingKey !== ''} onClick={() => deleteRow(record)}>
                Удалить
              </Typography.Link>
              </>
            );
          },
        },
      ];
    
      const mergedColumns = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: RepoPWithKey) => ({
            record,
            inputType: col.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      });
      
    return (
    <div className='repoedit__wrapper'>
      <div className="repoedit-title">Настройка прав доступа для репозитория - {repo_name}</div>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={repo}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
        <div>
          <div className='repoedit-addnew'>Добавить новое право доступа</div>
          <Select
            showSearch
            style={{marginLeft: 20}}
            placeholder="Выберите роль"
            optionFilterProp="children"
            onChange={setSelectedRole}
            onSearch={onSearchInput}
            options={roles}
          />
          <Select
            showSearch
            placeholder="Выберите путь"
            style={{width: 200, marginLeft: 10}}
            optionFilterProp="children"
            onChange={handlePathChange}
            onSearch={onSearchInput}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={options}
          />
          <Input style={{width: 60, marginLeft: 10}} placeholder='---' onChange={handleInputChange}/>
          <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16, marginLeft: 30}}>
            Добавить новое право
          </Button>
        </div>
    </div>
    )
}

export default Permission