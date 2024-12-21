// 'use client';

// import React, { useState, useEffect } from 'react';
// import type { PopUpProps, UserData } from '../types/index';

// const PopUp: React.FC<PopUpProps> = ({ isActive, onClose }) => {
//   const [formData, setFormData] = useState<UserData>({
//     bloodGroup: '',
//     contactNumber: '',
//     address: '',
//     parentsOccupation: '',
//     emergencyContactName: '',
//     emergencyContactNumber: '',
//     emergencyAddress: ''
//   });

//   const [previousData, setPreviousData] = useState<UserData | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (isActive) {
//       fetchUserData();
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isActive]);

//   const fetchUserData = async (): Promise<void> => {
//     try {
//       setIsLoading(true);
//       const response = await fetch('/api/user-details');
//       const data: UserData = await response.json();
      
//       setPreviousData(data);
//       setFormData(data);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent): Promise<void> => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/update-user', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         onClose();
//       }
//     } catch (error) {
//       console.error('Error updating user data:', error);
//     }
//   };

//   if (!isActive) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div 
//         className="absolute inset-0 bg-black/50"
//         onClick={onClose}
//       />
//       <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
//         {/* Header Section - Fixed */}
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold">Edit Profile Information</h2>
//         </div>

//         {/* Scrollable Content Section */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800" />
//             </div>
//           ) : (
//             <form id="editForm" onSubmit={handleSubmit} className="space-y-6">
//               {/* Personal Information Section */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Blood Group</label>
//                     <div className="text-xs text-gray-500 mb-1">Previous: {previousData.bloodGroup}</div>
//                     <input
//                       type="text"
//                       name="bloodGroup"
//                       value={formData.bloodGroup}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//                     <div className="text-xs text-gray-500 mb-1">Previous: {previousData.contactNumber}</div>
//                     <input
//                       type="tel"
//                       name="contactNumber"
//                       value={formData.contactNumber}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <div className="text-xs text-gray-500 mb-1">Previous: {previousData.address}</div>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows={2}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>

//               {/* Parents Information Section */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-gray-700">Parents Information</h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Occupation</label>
//                   <div className="text-xs text-gray-500 mb-1">Previous: {previousData.parentsOccupation}</div>
//                   <input
//                     type="text"
//                     name="parentsOccupation"
//                     value={formData.parentsOccupation}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>

//               {/* Emergency Contact Section */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-gray-700">Emergency Contact</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Contact Name</label>
//                     <div className="text-xs text-gray-500 mb-1">Previous: {previousData.emergencyContactName}</div>
//                     <input
//                       type="text"
//                       name="emergencyContactName"
//                       value={formData.emergencyContactName}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//                     <div className="text-xs text-gray-500 mb-1">Previous: {previousData.emergencyContactNumber}</div>
//                     <input
//                       type="tel"
//                       name="emergencyContactNumber"
//                       value={formData.emergencyContactNumber}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Emergency Address</label>
//                   <div className="text-xs text-gray-500 mb-1">Previous: {previousData.emergencyAddress}</div>
//                   <textarea
//                     name="emergencyAddress"
//                     value={formData.emergencyAddress}
//                     onChange={handleInputChange}
//                     rows={2}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>
//             </form>
//           )}
//         </div>

//         {/* Footer Section - Fixed */}
//         <div className="p-6 border-t border-gray-200">
//           <div className="flex justify-end space-x-3">
//             <button 
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               form="editForm"
//               className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PopUp;

'use client';

import React, { useState, useEffect } from 'react';
import type { PopUpProps, UserData } from '../types/index';

const PopUp: React.FC<PopUpProps> = ({ isActive, onClose }) => {
  const [formData, setFormData] = useState<UserData>({
    bloodGroup: '',
    contactNumber: '',
    address: '',
    parentsOccupation: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyAddress: ''
  });

  const [previousData, setPreviousData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isActive) {
      fetchUserData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isActive]);

  const fetchUserData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user-details');
      const data: UserData = await response.json();
      
      setPreviousData(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch('/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header Section - Fixed */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Edit Profile Information</h2>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800" />
            </div>
          ) : (
            <form id="editForm" onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <div className="text-xs text-gray-500 mb-1">Previous: {previousData?.bloodGroup}</div>
                    <input
                      type="text"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <div className="text-xs text-gray-500 mb-1">Previous: {previousData?.contactNumber}</div>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="text-xs text-gray-500 mb-1">Previous: {previousData?.address}</div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Parents Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Parents Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <div className="text-xs text-gray-500 mb-1">Previous: {previousData?.parentsOccupation}</div>
                  <input
                    type="text"
                    name="parentsOccupation"
                    value={formData.parentsOccupation}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <div className="text-xs text-gray-500 mb-1">Previous: {previousData?.emergencyContactName}</div>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <div className="text-xs text-gray-500 mb-1">Previous: {previousData?.emergencyContactNumber}</div>
                    <input
                      type="tel"
                      name="emergencyContactNumber"
                      value={formData.emergencyContactNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Address</label>
                  <div className="text-xs text-gray-500 mb-1">Previous: {previousData?.emergencyAddress}</div>
                  <textarea
                    name="emergencyAddress"
                    value={formData.emergencyAddress}
                    onChange={handleInputChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Section - Fixed */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="editForm"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
