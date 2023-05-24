'use client';
import {Button, Col, Row} from 'antd';
import Image from 'next/image';
import {mnemonicGenerate} from '@polkadot/util-crypto';

export default function Nav() {
  const generateMnemonic = () => {
    const mnemonic = mnemonicGenerate();
    console.log(`Generated mnemonic: ${mnemonic}`);
  }
  return (
      <>
        <Row align="middle">
          <Col span={6}>
            <Image src="/logo2.png" width={250} height={100} alt="Logo"></Image>
          </Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
          <Col span={6} align="middle">
            <Row justify="space-between" align="middle">
              <Col span={6}></Col>
              <Col span={6}></Col>
              <Col span={6}><Button onClick={generateMnemonic}>Register</Button></Col>
              <Col span={6}><Button type="primary">Login</Button></Col>
            </Row>
          </Col>
        </Row>
      </>
  );
}