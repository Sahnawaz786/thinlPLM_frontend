import React, { useContext, useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import HashLoader from 'react-spinners/HashLoader';
import CertificateServices from '../../../services/certificate.services';
import { categoryContext } from "../../../store/CategoryProvider";
import spinnerStyle from "../../../style.module.css";
import FileInput from '../../../utils/FileInput';
import { isAuthenticated } from "../../../utils/helper";
import styles from '../../Form/Parts/PartAttribut.module.css';

const CertificateDocEdit = ({ id }) => {

    const { getCertificateDocumentById } = new CertificateServices();
    const location = useLocation();
    const editId = location?.pathname?.split('/').slice(-1).join();
    console.log({ location: location?.pathname?.split('/').slice(-1).join() })
    const categoryItemsCtx = useContext(categoryContext);

    const [timer, setTimer] = useState(false);
    const navigate = useNavigate();
    const [attachments, setAttachments] = useState([]);
    const [userData, setUserData] = useState({
        document_number: "",
        document_name: "",
        description: "",
        createdDate: '',
        modifiedDate: '',
        docs: [
          {
            policy_number: '',
            supplier_name: "",
            attachmentId: '',
            insured_party: "",
            effective_date: "",
            expiration_date: "",
            insurance_company: "",
            iteration_info: 1,
            islatest_Iteration: 1,
            attachment: [
              {
                fileName: '',
                fileType: '',
                content: '',
                attachment_type: ''
              }
            ]
          }
        ]
    });

    const getPartApiEdit = async (id) => {
        try {
            const mypartData = await getCertificateDocumentById(id);
            console.log({ mypartData });
            const newParts = (mypartData?.data?.docs || []).sort((a, b) => b.id - a.id)?.[0];
            const newPartsData = { ...mypartData?.data, docs: [{ ...newParts } || {}] }
            setUserData(newPartsData);
            setAttachments(newPartsData?.docs[0]?.attachment);
        } catch (error) {
            console.log(error);
        }
    };

    console.log("USERDATA", { userData });
    console.log("ATTACHMENTS", { attachments });


    const handleFileUpload = (event, fileObj) => {
        const file = event.target.files[0];
        console.log('FILE', file);
        const reader = new FileReader();
        const title = event.target.name;

        console.log('Event', { title }, "fileObj", { fileObj });

        //



        reader.onloadend = () => {
            // After the file is loaded, store the result (Base64 string) in the state
            // setUserData(prevState => ({
            //     ...prevState,
            //     docs: prevState.docs.map(contract => ({
            //         ...contract,
            //     }))
            // }));
            const modifiedAttachment = attachments?.map((elem) => {
                if (elem?.id === fileObj?.id) {
                    return { ...elem, fileName: file.name, fileType: file.type, content: reader.result }
                }
                return elem;
            })
            console.log("MODIFIED", { modifiedAttachment });
            setAttachments(modifiedAttachment);
            //    setUserData((prevState)=>{
            //     return {
            //         ...prevState,
            //         docs:[{...prevState.docs?.[0],attachment:modifiedAttachment}]
            //     }
            //    })
        };


        console.log("USERDETAILS7", userData);

        // Read the file as a Data URL (Base64)
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (editId) {
            getPartApiEdit(editId);
            console.log({ test: "HELLO" })
        }
    }, [editId])
    console.log("DATAIS", userData)
    let name, value;
    const postUser = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserData(prevState => {
            return { ...prevState, [name]: value }
        })
    };

    const postUserData = (event, index) => {
        const { name, value } = event.target;
        const date = new Date().toJSON().slice(0, 10);
        console.log(date);
        setUserData((prevData) => {
            console.log("PREVDATA", prevData);
            const updatedParts = [...prevData.docs];
            console.log("UPDATE", updatedParts)
            updatedParts[index] = { ...updatedParts[index], [name]: value, modifiedDate: date };
            return { ...prevData, docs: updatedParts };
        });
        console.log("DATAISTHE", userData)
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        console.log("USER---DATA", { sajjad: { ...userData, docs: [{ ...userData?.docs[0], attachment: attachments }] } })

        try {
            // `http://localhost:8181/SupplierMasterObject`

            const res = await fetch(`http://localhost:8181/Certification_of_InsuranceMasterObject `, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${isAuthenticated()}`
                },
                body: JSON.stringify(
                    { ...userData, docs: [{ ...userData?.docs[0], attachment: attachments }] }
                )
            });

            // console.log({res});
            if (res.ok) {
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    let obj = {
        "insuranceCompany": attachments?.find((elem) => elem.attachmentType == "insuranceCompany"),
        "insuranceCoverage": attachments?.find((elem) => elem.attachmentType == "insuranceCoverage"),
    }

    // useEffect(()=>{
    //   setAttachments(userData?.docs[0]?.attachment);
    //   console.log('ATTACK',userData?.docs[0]);
    // },[])

    console.log("OBJ", { obj });

    return (
        timer ? <div className={spinnerStyle.spinnerContainer}>
            {' '}
            <HashLoader color='#0E6EFD' />{' '}
        </div>
            :
            <div>
                {/* <h3>Part Management</h3> */}
                <div className={styles.parentContainer}>
                    <div className={styles.childContainer}>
                        <div className={styles.systemAttribute}>
                            <div className={styles.part_container}>
                                <div className={styles.master_part}>
                                    <div className={styles.masterpart_header}>
                                        <p>System Attribute:-</p>
                                    </div>
                                    <div className={styles.formContainer}>
                                        <div className={styles.formInput}>
                                            <strong>Document Name(Non-Editable)</strong>
                                            <input
                                                type='text'
                                                name='document_name'
                                                value={userData?.document_name || ''}
                                                // onChange={(e) => postUser(e)}
                                                className={styles.partName}
                                                readOnly
                                            />
                                        </div>

                                        <div
                                            className={styles.formInput}
                                            style={{ marginTop: '10px' }}
                                        >
                                            <strong>Document Number(Non-Editable)</strong>
                                            <input
                                                className={styles.partNumber}
                                                name='document_number'
                                                // onChange={(e) => postUser(e)}
                                                value={userData?.document_number || ''}
                                                type='text'
                                                readOnly
                                            />
                                        </div>

                                        <div className={styles.formInput}>
                                            <strong>Description(Non-Editable)</strong>
                                            <textarea
                                                type='text'
                                                name='description'
                                                value={userData?.description || ''}
                                                // onChange={(e) => postUser(e)}
                                                className={styles.partName}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.bussinessAttribute}>
                            <div className={styles.part_container}>
                                <div className={styles.master_part}>
                                    <div className={styles.masterpart_header}>
                                        <p>Bussiness Attribute:-</p>
                                    </div>

                                    <div className={styles.formContainer}>
                                        <>
                                            <div className={styles.formInput}>
                                                <strong>Supplier Name(Non-Editable)</strong>
                                                <input
                                                    type="text"
                                                    name="supplier_name"
                                                    value={userData?.docs[0]?.supplier_name || ''}
                                                    onChange={(event) => postUserData(event, 0)}
                                                    readOnly
                                                />
                                            </div>

                                            <div className={styles.formInput}>
                                                <strong>Policy Number:</strong>
                                                <input
                                                    type='text'
                                                    name='policy_number'
                                                    value={userData?.docs[0]?.policy_number || ''}
                                                    className={styles.partName}
                                                    onChange={(event) => postUserData(event, 0)}
                                                />
                                            </div>

                                            <div className={styles.formInput}>
                                                <strong>Insured Company:</strong>
                                                <input
                                                    type='text'
                                                    name='insurance_company'
                                                    value={userData?.docs[0]?.insurance_company || ''}
                                                    className={styles.partName}
                                                    onChange={(event) => postUserData(event, 0)}
                                                />
                                            </div>

                                            <div className={styles.formInput}>
                                                <strong>Insured Party:</strong>
                                                <input
                                                    type='text'
                                                    name='insured_party'
                                                    value={userData?.docs[0]?.insured_party || ''}
                                                    className={styles.partName}
                                                    onChange={(event) => postUserData(event, 0)}
                                                />
                                            </div>
                    



                                            <div className={styles.formInput}>
                                                <strong htmlFor='document'>Insurance Company:</strong>
                                                <FileInput fileName={obj["insuranceCompany"]} setFileName={handleFileUpload} />

                                            </div>

                                            <div className={styles.formInput}>
                                                <strong htmlFor='document'>Insurance Coverage:</strong>
                                                <FileInput fileName={obj["insuranceCoverage"]} setFileName={handleFileUpload} />

                                            </div>




                                            <div className={styles.formInput}>
                                                <strong>Certification Date:</strong>
                                                <input
                                                    type='date'
                                                    name='effective_date'
                                                    value={userData?.docs[0]?.effective_date || ''}
                                                    className={styles.partName}
                                                    onChange={(event) => postUserData(event, 0)}
                                                />
                                            </div>
                                            <div className={styles.formInput}>
                                                <strong>Expiration Date:</strong>
                                                <input
                                                    type='date'
                                                    name='expiration_date'
                                                    value={userData?.docs[0]?.expiration_date || ''}
                                                    className={styles.partName}
                                                    onChange={(event) => postUserData(event, 0)}
                                                />
                                            </div>
                                           
                                           
                                        </>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'right' }}>
                                <Button variant='primary' onClick={(e) => submitHandler(e)}>
                                    Submit
                                </Button>{' '}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default CertificateDocEdit;