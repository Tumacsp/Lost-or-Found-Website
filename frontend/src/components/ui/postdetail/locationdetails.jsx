import React from 'react';

// Component สำหรับแต่ละรายการของที่อยู่
const LocationItem = ({ label, value, className = "" }) => {
  if (!value) return null;

  return (
    <div className={`flex items-center bg-white p-3 rounded-lg shadow-sm ${className}`}>
      <span className="font-bold text-gray-700 w-32">
        {label}:
      </span>
      <span className="text-gray-600">
        {value}
      </span>
    </div>
  );
};

// Component หลักสำหรับแสดงรายละเอียดที่อยู่
const LocationDetails = ({ addressDetail, coordinates, error, isLoading }) => {
  if (error) {
    return (
      <div className="bg-red-50 p-3 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading || !addressDetail.province) {
    return (
      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
        <p className="text-sm sm:text-base text-gray-600">
          Loading location...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <LocationItem label="Road" value={addressDetail.road} />
      <LocationItem label="Sub-district" value={addressDetail.subdistrict} />
      <LocationItem label="District" value={addressDetail.district} />
      <LocationItem label="Province" value={addressDetail.province} />
      <LocationItem label="Postal Code" value={addressDetail.postcode} />
      
      {/* สำหรับพิกัด */}
      {coordinates && (
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
          <span className="font-semibold text-gray-700 min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">
            Coordinates:
          </span>
          <span className="text-gray-600 text-sm sm:text-base">
            ({coordinates.latitude}, {coordinates.longitude})
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationDetails;
