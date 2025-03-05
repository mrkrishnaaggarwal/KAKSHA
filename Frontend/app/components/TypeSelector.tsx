import React from 'react';

type PostType = 'announcement' | 'homework' | 'cancelClass';

interface TypeSelectorProps {
  onSelectType: (type: PostType) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ onSelectType }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <button
        type="button"
        onClick={() => onSelectType('announcement')}
        className="flex items-center text-purple-600 hover:bg-purple-50 rounded-md border border-purple-100 transition-all min-w-fit p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Announcement</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectType('homework')}
        className="flex items-center text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-all min-w-fit p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
          <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
        <span className="font-medium">Homework</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectType('cancelClass')}
        className="flex items-center text-red-600 hover:bg-red-50 rounded-md border border-red-100 transition-all  min-w-fit p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Cancel Class</span>
      </button>
    </div>
  );
};

export default TypeSelector;