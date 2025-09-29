import AdminDashboard from '../admin/AdminDashboard';

export default function AdminDashboardExample() {
  return (
    <AdminDashboard 
      onUserAction={(action, userId) => console.log('User action:', action, userId)}
      onCardAction={(action, cardId) => console.log('Card action:', action, cardId)}
    />
  );
}