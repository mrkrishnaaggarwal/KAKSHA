
export interface MainLayoutProps {
  phone: string;
  address: string;
}

export interface EditButtonProps {
  onClick: () => void;
}

export interface PopUpProps {
  isActive: boolean;
  onClose: () => void;
}

export interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
}

export interface UserData {
  bloodGroup: string;
  contactNumber: string;
  address: string;
  parentsOccupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyAddress: string;
}