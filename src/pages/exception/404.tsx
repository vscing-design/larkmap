import { Button, Result } from '@/components/vscing-design';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();

  return (
    <Result
      title="404"
      description="对不起，您访问的页面不存在。"
      extra={
        <Button onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  );
};
