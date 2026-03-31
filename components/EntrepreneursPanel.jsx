import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const statusTypes = [
  { label: "All", value: "All" },
  { label: "Approved", value: "Approved" },
  { label: "Pending", value: "Pending" },
];

const sectorTypes = [
  { label: "All", value: "All" },
  { label: "Agriculture", value: "Agriculture" },
  { label: "Livestock", value: "Livestock" },
  { label: "Fishing", value: "Fishing" },
  { label: "Processing", value: "Processing" },
  { label: "Services", value: "Services" },
  { label: "Trade", value: "Trade" },
  { label: "Other", value: "Other" },
];

export const EntrepreneursPanel = () => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSector, setSelectedSector] = useState("All");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, "Users");

        const statusArray =
          selectedStatus === "Approved"
            ? ["10"]
            : selectedStatus === "Pending"
            ? ["6"]
            : ["6", "10"];

        const usersQuery = query(
          usersCollection,
          where("user_type", "==", "Entrepreneur"),
          where("user_profile_setup_step", "in", statusArray)
        );

        const querySnapshot = await getDocs(usersQuery);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching entrepreneurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [selectedStatus]);

  const filteredUsers = useMemo(() => {
    if (selectedSector === "All") return users;
    return users.filter(
      (u) => u.user_preferred_sector_to_specialize === selectedSector
    );
  }, [users, selectedSector]);

  const downloadUsers = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      alert("No entrepreneurs to download");
      return;
    }

    setLoading(true);

    try {
      const mappedUsers = filteredUsers.map((u) => ({
        Name: u.user_full_name || "",
        Phone: u.user_phone || "",
        Email: u.user_email || "",
        Sex: u.user_sex || "",
        "Date of Birth": u.user_birth_date
          ? new Date(u.user_birth_date.seconds * 1000).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            )
          : "",
        Region: u.user_region || "",
        District: u.user_district || "",
        "Business Name": u.user_highest_institution_name || "",
        Sector: u.user_preferred_sector_to_specialize || "",
        "Main Activity": u.user_business_ownership_details || "",
        "Formalization Status": u.user_business_is_formalized || "",
        "Years in Operation": u.user_business_started || "",
        "Number of Employees": u.user_business_plan || "",
        "Monthly Revenue": u.user_monthly_income || "",
        "Business Challenges": Array.isArray(u.user_areas_of_interest)
          ? u.user_areas_of_interest.join(", ")
          : u.user_areas_of_interest || "",
        "Received Support Before": u.user_has_received_support || "",
        "Support Needed": Array.isArray(u.user_available_times)
          ? u.user_available_times.join(", ")
          : u.user_available_times || "",
        "TIN / Reg No.": u.user_current_mo || "",
        "Has Disability": u.user_has_disability || "",
        "Application Status":
          u.user_profile_setup_step === "10" ? "Approved" : "Pending",
        "Registration Date": u.user_creation_date
          ? new Date(u.user_creation_date.seconds * 1000).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            )
          : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(mappedUsers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Entrepreneurs");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(data, "entrepreneurs_export.xlsx");
    } catch (error) {
      console.error("Error exporting entrepreneurs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-2 rounded-2xl bg-gray-300 tracking-wide">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md font-bold">Entrepreneurs panel</p>
          <p className="text-sm font-light">
            Define entrepreneur data you want to export
          </p>
        </div>
        <div
          className={`bg-white p-1 w-10 h-10 rounded-full flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={!loading ? downloadUsers : undefined}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </div>
      </div>

      <hr className="border-t border-slate-100 my-2" />

      <div className="mt-2">
        <span className="text-sm font-medium text-gray-700">Select status</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {statusTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setSelectedStatus(type.value)}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition cursor-pointer
              ${
                selectedStatus === type.value
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
        <span className="text-sm font-medium text-gray-700">Select sector</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {sectorTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setSelectedSector(type.value)}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition cursor-pointer
              ${
                selectedSector === type.value
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
        <p className="text-black text-sm tracking-wide font-light">
          {loading ? "Loading..." : `You are about to export ${filteredUsers.length} entrepreneurs.`}
        </p>
      </div>
    </div>
  );
};
