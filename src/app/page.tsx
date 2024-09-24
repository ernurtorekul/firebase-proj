"use client";
import { Auth } from "@/app/components/auth";
import { db, auth, storage } from "../config/firebase";
import { useEffect, useState } from "react";
import {
  doc,
  getDocs,
  collection,
  Timestamp,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Input, Checkbox, Button } from "antd";
import { ref, uploadBytes } from "firebase/storage";

interface Student {
  id: string;
  nameSurname: string;
  newStudentsName: string;
  specialty: string;
  newSpecialty: string;
  specialty_code: string;
  newSpecialtyCode: string;
  dd_mm_yy: any;
  in_grant: boolean;
  newInGrant: boolean;
}

export default function Home() {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const studentsCollectionRef = collection(db, "students");

  // new students
  const [newStudentsName, setNewStudentsName] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newSpecialtyCode, setNewSpecialtyCode] = useState("");
  const [newInGrant, setNewInGrant] = useState(false);

  //update
  const [updateName, setUpdateName] = useState("");

  // upload file
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const getStudentsList = async () => {
    try {
      const data = await getDocs(studentsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        dd_mm_yy: doc.data().dd_mm_yy?.toDate(), // converting firebase's timestamp to readable js format
      })) as Student[];
      // console.log(filteredData);
      setStudentsList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getStudentsList();
  }, []);

  const onDelete = async (id: string) => {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
  };

  const onUpdate = async (id: string) => {
    const studentDoc = doc(db, "students", id);
    await updateDoc(studentDoc, { newStudentsName: updateName });
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `folder_students/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitStudent = async () => {
    const dd_mm_yy = Timestamp.fromDate(new Date(newBirthDate)); // converting str to timestamp
    try {
      await addDoc(studentsCollectionRef, {
        newStudentsName: newStudentsName,
        dd_mm_yy: dd_mm_yy,
        newSpecialty: newSpecialty,
        newSpecialtyCode: newSpecialtyCode,
        in_grant: newInGrant,
        userId: auth?.currentUser?.uid,
      });
      getStudentsList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col h-full w-full justify-center items-center mt-8">
        <Auth />
        <div className="space-y-4 mb-4 flex flex-col w-72 justify-center">
          <Input
            placeholder="enter your name & surname"
            onChange={(e) => setNewStudentsName(e.target.value)}
          />
          <Input
            placeholder="specialty"
            onChange={(e) => setNewSpecialty(e.target.value)}
          />
          <Input
            placeholder="specialty code"
            onChange={(e) => setNewSpecialtyCode(e.target.value)}
          />
          <Input
            placeholder="birthdate"
            type="date"
            onChange={(e) => setNewBirthDate(e.target.value)}
          />
          <div className="flex items-center justify-center gap-2">
            <Checkbox onChange={(e) => setNewInGrant(e.target.checked)} />
            <label>in grant</label>
          </div>
          <Button type="primary" onClick={onSubmitStudent}>
            Send
          </Button>
        </div>
        <div className="w-72">
          {studentsList.map((students) => {
            return (
              <div key={students.id} className="border-2 border-gray-700 mb-4">
                <h1 style={{ color: students.in_grant ? "green" : "red" }}>
                  {students.newStudentsName}
                  {students.nameSurname}
                </h1>
                <p>Birth date: {students.dd_mm_yy?.toLocaleDateString()}</p>{" "}
                {/* displaying the formatted date*/}
                <p>
                  Specialty: {students.specialty}
                  {students.newSpecialty}
                </p>
                <p>
                  Specialty code: {students.specialty_code}
                  {students.newSpecialtyCode}
                </p>
                <Button onClick={() => onDelete(students.id)}>Delete</Button>
                <Input
                  className="mt-2 mb-2"
                  placeholder="name"
                  onChange={(e) => setUpdateName(e.target.value)}
                />
                <Button onClick={() => onUpdate(students.id)}>
                  change name
                </Button>
                <div>
                  <Input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <Button onClick={uploadFile}>upload</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
