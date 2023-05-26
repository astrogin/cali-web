'use client';
import {Button, Col, Form, Input, Modal, Row, Typography} from 'antd';
import Image from 'next/image';
import {mnemonicGenerate} from '@polkadot/util-crypto';
import {useSubstrate, useSubstrateDispatch} from '@/lib/polkadot';
import {useState} from 'react';
import Profile from '@/components/profile';

export default function Nav() {
  const {api, keyring, profileAddress} = useSubstrate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const substrateDispatch = useSubstrateDispatch();
  const createAccount = () => {
    const mnemonic = mnemonicGenerate();
    const newPair = keyring.addUri(mnemonic);
    const newAccount = {...newPair, mnemonic};
    console.log('Registered account', newAccount);
    Modal.success({
      width: 500,
      content: (
          <div>
            <p>mnemonic: <Typography.Text type="success"
                                          style={{fontSize: 20}}>{mnemonic}</Typography.Text>
            </p>
            <p>address: <Typography.Text type="success"
                                         style={{fontSize: 20}}>{newAccount.pair.address}</Typography.Text>
            </p>
          </div>
      ),
    });
  };
  const submitLogin = async (props) => {
    console.log('props', props);

    const system_account = await api.query.system.account(props.address); // replace with the actual account address

    console.log(`Balance of account: ${system_account.data.free}`);
    substrateDispatch({type: 'saveAddress', profileAddress: props.address});
    setIsLoginModalOpen(false);
  };
  return (
      <>
        <Row align="middle">
          <Col span={6}>
            <Image src="/logo2.png" width={250} height={100} alt="Logo"></Image>
          </Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
          <Col span={6} align="bottom">
            {profileAddress ?
                <Row justify="space-between" align="bottom">
                  <Col span={24}>
                    <Profile></Profile>
                  </Col>
                </Row> :
                <Row justify="space-between" align="middle">
                  <Col span={6}></Col>
                  <Col span={6}></Col>
                  <Col span={6}><Button
                      onClick={createAccount}>Register</Button></Col>
                  <Col span={6}>
                    <Button type="primary"
                            onClick={e => setIsLoginModalOpen(
                                true)}>Login</Button></Col>
                </Row>
            }
          </Col>
        </Row>
        <Modal
            title="Login"
            open={isLoginModalOpen}
            okButtonProps={{style: {display: 'none'}}}
            cancelButtonProps={{style: {display: 'none'}}}
        >
          <Form
              name="basic"
              style={{maxWidth: 600}}
              onFinish={submitLogin}
              autoComplete="off"
          >
            <Form.Item
                label="address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: 'Please input your mnemonic!',
                  }]}
            >
              <Input/>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
  )
      ;
}