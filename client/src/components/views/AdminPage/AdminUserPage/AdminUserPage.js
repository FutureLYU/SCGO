import React, { useEffect, useState } from 'react';
import { Layout, Menu, Table, Tag, Button, Input, Row, Col } from 'antd';
import Axios from 'axios';

const { Content, Sider } = Layout;
const { Column }  = Table;
const { Search } = Input;

function UserControl(props) {
    
    const [UserData, setUserData] = useState([]);
    const [SearchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (props.user.userData) {
            if (!props.user.userData.isAdmin) {
                props.history.push("/403");
            }
            getUserInfo({});
        }
    }, [props]);


    const handleProductClick = () => {
        props.history.push("/admin/product");
    };

    const handleUserClick = () => {
        props.history.push("/admin/user");
    };

    const getUserInfo = (rule) => {
        Axios.post('/api/users/getUserByRule', rule)
            .then((response) => {
                if (response.data.success) {
                    const userinfo = response.data.users.map((user, index) => {
                        return {
                            key: index,
                            userid: user._id,
                            username: user.username,
                            userstate: user.role
                        }
                    })
                    console.log(userinfo)
                    setUserData(userinfo);
                } else {
                    console.log('no results')
                    setUserData([])
                }
            })
    }

    const onChangeSearch = (event) => {
        setSearchTerm(event.currentTarget.value)
    }

    const onSubmit = () => {
        const rule = {
            searchTerm: SearchTerm
        }
        getUserInfo(rule);
    }

    const blockUser = (userid) => {
        Axios.post('/api/users/updateUserState', {
            userid: userid,
            role: -1,
        }).then((response) => {
            if (response.data.success) {
                alert("Block Succeed");
                onSubmit();
            }
        })
    }

    const unblockUser = (userid) => {
        Axios.post('/api/users/updateUserState', {
            userid: userid,
            role: 0
        }).then((response) => {
            if (response.data.success) {
                alert("Unblock Succeed");
                onSubmit();
            }
        })
    }

    return (
        <Layout>
            <Sider
                width={200}
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                }}
                className="site-layout-background"
            >
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["2"]}
                    defaultOpenKeys={["sub1"]}
                    style={{ height: "100%", borderRight: 0 }}
                >
                    <Menu.Item onClick={handleProductClick} key="1">
                        物品审核
                    </Menu.Item>
                    <Menu.Item onClick={handleUserClick} key="2">
                        用户审核
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        marginLeft: "200px",
                        minHeight: 1200,
                    }}
                >
                    {/* Search */}
                    <div 
                        style={{ 
                            background: 'white', 
                            marginBottom: '20px',
                            margin: "1rem auto",
                            width: "100%"
                        }}
                    >
                        <br />
                        <Row gutter={4}>
                            <Col lg={2} xs={12}>
                                <h3 style={{ margin: "auto"}}>&nbsp;&nbsp;&nbsp;&nbsp;USER ID查询:</h3>
                            </Col>
                            <Col lg={6} xs={24}>
                                <div style={{ maxWidth: "400px" }} >
                                    <Search
                                        value={SearchTerm}
                                        onChange={onChangeSearch}
                                        onSearch={onSubmit}
                                        enterButton="Search"
                                        placeholder="24-character user id"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <br />
                    </div>

                    {/* Table */}
                    <div style={{ background: 'white', marginBottom: '20px'}}>
                        <h3 style={{ padding: '1rem 1rem 1rem 1rem' }}>查询表格</h3>
                        <Table 
                            style={{ background: 'white' }}
                            dataSource={UserData.length > 0? UserData: null}
                        >
                            <Column bordered={false} title="User ID" dataIndex="userid" key="userid" />
                            <Column bordered={false} title="Username" dataIndex="username" key="username" />
                            <Column
                                bordered={false}
                                title="User State"
                                dataIndex="userstate"
                                key="userstate"
                                render={tag => ( 
                                    <Tag color={tag === -1 ? "red" : "green"} key={tag}> 
                                        {tag === -1 ? "blocked" : "normal" } 
                                    </Tag>
                                )}
                            />
                            <Column
                                bordered={false}
                                title="Action"
                                key="action"
                                render={(text, record) => (
                                    <div>
                                        <Button 
                                            style={{width: '80px'}}
                                            disabled={record.userstate !== 0 ? true : false} 
                                            onClick={()=>blockUser(record.userid)}
                                        >
                                            Block
                                        </Button>&nbsp;
                                        <Button 
                                            style={{width: '80px'}}
                                            disabled={record.userstate !== -1 ? true : false} 
                                            onClick={()=>unblockUser(record.userid)}
                                        >
                                            Unblock
                                        </Button>
                                    </div>
                                )}
                            />
                        </Table>
                    </div>
                    


                </Content>
            </Layout>
          
        </Layout>
      )
}

export default UserControl
