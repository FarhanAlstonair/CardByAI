import UserDashboard from '../dashboard/UserDashboard';

export default function UserDashboardExample() {
  return (
    <UserDashboard 
      onCreateNew={() => console.log('Create new card clicked')}
      onEditCard={(cardId) => console.log('Edit card:', cardId)}
      onDeleteCard={(cardId) => console.log('Delete card:', cardId)}
      onExportCard={(cardId) => console.log('Export card:', cardId)}
    />
  );
}