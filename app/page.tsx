'use client';
//import styles from './page.module.css';
import Balances from '@/components/balances';
import Nav from '@/components/nav';
import {Col, Row, Divider} from 'antd';

export default function Home() {
  return (
      <main>
        <Row>
          <Col span={24}>
            <Nav></Nav>
          </Col>
        </Row>
        <Divider orientation="left"><h4>Balances</h4></Divider>
        <Row>
          <Col span={24}>
            <Balances></Balances>
          </Col>
        </Row>
      </main>
  );
}
