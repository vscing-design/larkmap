
import { Button, Result } from '@/components/vscing-design';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();

  return (
    <Result
      title="403"
      description="对不起，您没有权限访问此页面。"
      extra={
        <Button onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  );
};
