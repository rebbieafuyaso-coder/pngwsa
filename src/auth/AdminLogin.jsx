import { Card, Col, Form, Input, Row, Button } from "antd"
import { useForm } from "antd/es/form/Form"
import api from "../services/api";


export default function AdminLogin() {
  const {form} = useForm;
  const handleLogin = (events) => {
    const res = api.post("/auht/login");
    console.log(res);
    
  }
  return(
    <>
      <main>
        <Row>
          <Col>
            <Card>
              <Form
              form={form}
              onFinish={handleLogin}
              >
                <Form.Item label="Email">
                  <Input placeholder="Enter Email Here..." />
                </Form.Item>
                <Form.Item label="Password" rules={[{ required: true, message: "Password is required"}]}>
                  <Input placeholder="Enter password..." />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary"> 
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </main>
    </>
  )
}