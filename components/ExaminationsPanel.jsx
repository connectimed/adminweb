import { UserAuth } from "@/lib/AuthContext";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const moduleTypes = [
  { label: "Exams → Students", value: "Exams" },
  { label: "Students → Exams", value: "Students" },
];
const sortTypes = [{ label: "Date Created", value: "Time" }];

export const ExaminationsPanel = () => {
  const { userData, logOut } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("Exams");
  const [selectedGender, setSelectedGender] = useState("Time");
  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);

      try {
        const modulesCollection = collection(db, "Modules");

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
          modulesCollection,
          where("module_has_exam", "==", true)
          // where("user_sex", "in", genderArray)
        );

        const querySnapshot = await getDocs(usersQuery);
        const examsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExams(examsData);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      setLoading(true);

      try {
        const usersCollection = collection(db, "Users");

        const genderArray =
          selectedGender && selectedGender !== "All"
            ? [selectedGender]
            : ["Male", "Female"]; // all genders

        // Construct query
        const usersQuery = query(
          usersCollection,
          where("user_type", "==", "Student")
          // where("user_sex", "in", genderArray)
        );

        const querySnapshot = await getDocs(usersQuery);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedType == "Exams") {
      fetchModules();
    } else {
      fetchUsers();
    }
  }, [selectedType, selectedGender]);

  const downloadData = () => {
    if (selectedType == "Exams") {
      downloadModules();
    } else {
      downloadUsers();
    }
  };

  const downloadModules = () => {
    if (!exams || exams.length === 0) {
      alert("No exams to download");
      return;
    }

    setLoading(true);

    try {
      // 1. Map exams to only the required fields
      const mappedModules = exams.map((u) => ({
        "Exam Title": u.module_exam_title || "",
        Instructions: u.module_exam_instructions || "",
        Duration: u.module_exam_duration || "",
        "Created Date": u.module_exam_submitted_time
          ? new Date(
              u.module_exam_submitted_time.seconds * 1000
            ).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
        "Number Of Questions": u.module_exam_total_questions || "",
        "Students taking exam": u.module_students_taken_exam.length || "",
      }));

      // 2. Convert mapped exams to worksheet
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
      saveAs(data, `exams_export.xlsx`);
    } catch (error) {
      console.error("Error exporting exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadUsers = () => {
    if (!users || users.length === 0) {
      alert("No users to download");
      return;
    }

    setLoading(true);

    try {
      // exam metadata
      const exams = [
        { id: "PzqpMOe6eQea5C9Sj398", name: "Personal Development" },
        { id: "Jhp1MqkBltfYWhdcf5es", name: "Personal Effectiveness" },
        { id: "TVwAxIGwRIjrfHCG1KzQ", name: "Entrepreneurship" },
      ];

      const mappedUsers = users.map((u) => {
        let row = {
          "Student's name": u.user_full_name || "",
          "Student's phone": u.user_phone || "",
          "Registration Date": u.user_creation_date
            ? new Date(u.user_creation_date.seconds * 1000).toLocaleDateString(
                "en-GB",
                { day: "2-digit", month: "short", year: "numeric" }
              )
            : "",
        };

        // add exams dynamically
        exams.forEach((exam, index) => {
          const score = u.user_exams?.[exam.id]; // check if student has exam
          row[`Exam ${index + 1}`] = exam.name;
          row[`Has Taken Exam ${index + 1}`] =
            score !== undefined ? "Yes" : "No";
          row[`Exam ${index + 1} Score`] =
            score !== undefined ? Math.min(score, 100) : "";
        });

        return row;
      });

      // Convert mapped users to worksheet
      const worksheet = XLSX.utils.json_to_sheet(mappedUsers);

      // Create workbook and append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      // Write workbook
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Save file
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(data, `users_exams_export.xlsx`);
    } catch (error) {
      console.error("Error exporting users to exams:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-2 rounded-2xl bg-gray-300 tracking-wide">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-md font-bold">Examinations panel</p>
          <p className="text-sm font-light">
            Define the examination data to export
          </p>
        </div>
        <div
          className="bg-white p-1 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          onClick={downloadData} // Toggle edit on click
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </div>
      </div>

      <hr className="border-t border-slate-100 my-2" />

      <div className="mt-2">
        <span className="text-sm font-medium text-gray-700">
          Select base entity
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
        <span className="text-sm font-medium text-gray-700">Sort data by</span>
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
          {selectedType == "Exams"
            ? `You are about to export ${exams.length} exams.`
            : `You are about to export ${users.length} examinee.`}
        </p>
      </div>
    </div>
  );
};
