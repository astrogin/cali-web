import {
  EditOutlined,
  EllipsisOutlined, LogoutOutlined, SendOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {Avatar, Button, Card, Form, Input, Modal} from 'antd';
import {useSubstrate} from '@/lib/polkadot';
import {useEffect, useState} from 'react';

const {Meta} = Card;

export default function Profile() {
  const {api, keyring, profileAddress} = useSubstrate();
  const [balance, setBalance] = useState();
  const [isSendTokensModalOpen, setIsSendTokensModalOpen] = useState(false);
  useEffect(() => {
    api.query.system.account(profileAddress).then(account => {
      setBalance(account.data.free);
    });
  }, [profileAddress]);
  const sendTokens = async (props) => {
    const {pair} = keyring.addUri(props.sign);
    const account = await api.query.system.account(pair.address);
    console.log('balance', account.data.free.toHuman())
    console.log('acc', pair);
    await api.tx.balances.transfer(props.address, props.amount).
        signAndSend(pair);
  };
  return (
      <>
        <Card
            style={{width: 300}}
            actions={[
              <SendOutlined key="sendToken"
                            onClick={e => {setIsSendTokensModalOpen(true);}}/>,
              <LogoutOutlined key="logout"/>,
            ]}
        >
          <Meta
              avatar={<Avatar
                  src="https://xsgames.co/randomusers/avatar.php?g=pixel"/>}
              title={profileAddress}
              description={'Balance:' + balance}
          />
        </Card>
        <Modal
            title="Send tokens"
            open={isSendTokensModalOpen}
            okButtonProps={{style: {display: 'none'}}}
            cancelButtonProps={{style: {display: 'none'}}}
        >
          <Form
              name="sendTokens"
              style={{maxWidth: 600}}
              onFinish={sendTokens}
              autoComplete="off"
          >
            <Form.Item
                label="address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: 'Please input your address!',
                  }]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
                label="sign"
                name="sign"
                rules={[
                  {
                    required: true,
                    message: 'Please input your sign!',
                  }]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                  {
                    required: true,
                    message: 'Please input your amount!',
                  }]}
            >
              <Input/>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
              <Button type="primary" htmlType="submit">
                Send
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
  );
}