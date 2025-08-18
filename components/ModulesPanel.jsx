import { UserAuth } from "@/lib/AuthContext";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const moduleTypes = [{ label: "All Modules", value: "All" }];
const sortTypes = [
  { label: "Time Created", value: "Time" },
  { label: "Students Count", value: "Students" },
  { label: "Topics Count", value: "Topics" },
];

export const ModulesPanel = () => {
  const { userData, logOut } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);

      try {
        const usersCollection = collection(db, "Modules");

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
          usersCollection
          // where("user_type", "in", typesArray),
          // where("user_sex", "in", genderArray)
        );

        const querySnapshot = await getDocs(usersQuery);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setModules(usersData);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [selectedType, selectedGender]);

  const downloadModules = () => {
    if (!modules || modules.length === 0) {
      alert("No modules to download");
      return;
    }

    setLoading(true);

    try {
      // 1. Map modules to only the required fields
      const mappedModules = modules.map((u) => ({
        Title: u.module_title || "",
        Description: u.module_description || "",
        "Created By": u.module_poster_name || "",
        "Created Date": u.module_posted_time
          ? new Date(u.module_posted_time.seconds * 1000).toLocaleDateString(
              "en-GB",
              { day: "2-digit", month: "short", year: "numeric" }
            )
          : "",
        Students: u.module_enrolled_student_ids.length || "",
        Topics: u.module_topics_count || "",
      }));

      // 2. Convert mapped modules to worksheet
      const worksheet = XLSX.utils.json_to_sheet(mappedModules);

      // 3. Create a workbook and append worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Modules");

      // 4. Write workbook to binary
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // 5. Save file
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(data, `modules_export.xlsx`);
    } catch (error) {
      console.error("Error exporting modules:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-2 rounded-2xl bg-gray-300 tracking-wide">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md font-bold">Modules panel</p>
          <p className="text-sm font-light">
            Define the modules you want to export
          </p>
        </div>
        <div
          className="bg-white p-1 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          onClick={downloadModules} // Toggle edit on click
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </div>
      </div>

      <hr className="border-t border-slate-100 my-2" />

      <div className="mt-2">
        <span className="text-sm font-medium text-gray-700">
          Select module type
        </span>
        <div className="mt-1 flex flex-wrap gap-2">
          {moduleTypes.map((type) => (
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
          Sort modules by
        </span>
        <div className="mt-1 flex flex-wrap gap-2">
          {sortTypes.map((type) => (
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
          You are about to export {modules.length} modules.
        </p>
      </div>
    </div>
  );
};
