'use client';
import {useSubstrate} from '@/lib/polkadot';
import {useEffect, useState} from 'react';
import {Table} from 'antd';

export default function Balances() {
  const {api} = useSubstrate();
  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
  ];
  const [tableData, setTableDate] = useState([]);
  useEffect(() => {
    const getAccounts = async () => {
      if (api && api.query.system) {
        const entries = await api.query.system.account.entries();
        const accounts = [];
        entries.forEach(([key, value]) => {
          accounts.push({
            key: key.toHuman(),
            address: key.toHuman(),
            amount: value.data.free.toHuman(),
          });
        });
        setTableDate(accounts);
      }
    };
    getAccounts();
  }, [api]);

  return api && api.query.system && tableData.length ? (
      <Table dataSource={tableData} columns={columns}/>
  ) : null;
};
