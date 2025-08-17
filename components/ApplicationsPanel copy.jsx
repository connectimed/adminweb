import { UserAuth } from "@/lib/AuthContext";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const userTypes = [
  { label: "All Users", value: "All" },
  { label: "Students", value: "Student" },
  { label: "Mentors", value: "Mentor" },
  { label: "Admins", value: "Admin" },
];
const genderTypes = [
  { label: "All Genders", value: "All" },
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

export const ApplicationsPanel = () => {
  const { userData, logOut } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const usersCollection = collection(db, "Users");

        // Build arrays for 'in' queries
        const typesArray =
          selectedType && selectedType !== "All"
            ? [selectedType]
            : ["Admin", "Mentor", "Student"]; // all types

        const genderArray =
          selectedGender && selectedGender !== "All"
            ? [selectedGender]
            : ["Male", "Female"]; // all genders

        // Construct query
        const usersQuery = query(
          usersCollection,
          where("user_type", "in", typesArray),
          where("user_sex", "in", genderArray)
        );

        const querySnapshot = await getDocs(usersQuery);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [selectedType, selectedGender]);

  const downloadUsers = () => {
    if (!users || users.length === 0) {
      alert("No users to download");
      return;
    }

    setLoading(true);

    try {
      // 1. Map users to only the required fields
      const mappedUsers = users.map((u) => ({
        "Full Name": u.user_full_name || "",
        "User Type": u.user_type || "",
        "Phone Number": u.user_phone || "",
        Sex: u.user_sex || "",
        "Birth Date": u.user_birth_date
          ? new Date(u.user_birth_date.seconds * 1000).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            )
          : "",
        "Marital Status": u.user_marital_status || "",
        Region: u.user_region || "",
        District: u.user_district || "",
      }));

      // 2. Convert mapped users to worksheet
      const worksheet = XLSX.utils.json_to_sheet(mappedUsers);

      // 3. Create a workbook and append worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      // 4. Write workbook to binary
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // 5. Save file
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(data, `users_export_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error("Error exporting users:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="px-4 py-2 rounded-2xl bg-gray-300 tracking-wide">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md font-bold">Applications panel</p>
          <p className="text-sm font-light">
            Define the type of users you want to export
          </p>
        </div>
        <div
          className="bg-white p-1 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          onClick={downloadUsers} // Toggle edit on click
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </div>
      </div>

      <hr className="border-t border-slate-100 my-2" />

      <div className="mt-2">
        <span className="text-sm font-medium text-gray-700">
          Select user type
        </span>
        <div className="mt-1 flex flex-wrap gap-2">
          {userTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition cursor-pointer
              ${
                selectedType === type.value
                  ? "bg-deep-dark text-white border-deep-dark"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <span className="text-sm font-medium text-gray-700">
          Select gender type
        </span>
        <div className="mt-1 flex flex-wrap gap-2">
          {genderTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setSelectedGender(type.value)}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition cursor-pointer
              ${
                selectedGender === type.value
                  ? "bg-deep-dark text-white border-deep-dark"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center border border-slate-400 mt-6 rounded-lg px-2 py-2 space-x-3 mb-4">
        <InformationCircleIcon className="h-5 w-5" />

        <p className=" text-black text-sm tracking-wide font-light">
          You are about to export {users.length} users.
        </p>
      </div>
    </div>
  );
};
