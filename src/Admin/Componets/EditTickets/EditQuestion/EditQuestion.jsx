import React, { useRef } from 'react';
import gif from '../../../../../assets/check.gif';
import logoDeleteImg from '../../../../../assets/deleteImg.svg';
import InputQuestion from './InputQuestion.jsx';
import InputAnswer from './InputAnswer.jsx';
import InputHelp from './InputHelp.jsx';
import s from './editQuestion.module.css';
import DeleteQuestion from './DeleteQuestion.jsx';

function EditQuestion({ selectedTicket, indexTicket, idSelectedTicket, isImg, setIsImg }) {
    const [imgSrc, setImgSrc] = React.useState(selectedTicket[indexTicket].img);
    const [isGif, setIsGif] = React.useState(false);
    console.log(isImg);
    const correctAnswer = selectedTicket[indexTicket].answers.findIndex(obj => obj.isCorrect === true);
    const token = localStorage.getItem('token');
    const ref = React.useRef(null);

    async function saveTicket(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (isImg) formData.delete('img');

        formData.append('ticketId', idSelectedTicket);
        formData.append('questionId', selectedTicket[indexTicket].questionId);

        const res = await fetch('http://147.45.159.11/api/ticketEditor/editQuestion', {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        setIsGif(true);

        if (res.ok) {
            setTimeout(() => {
                setIsGif(false);
                setIsImg(false);
            }, 1250);
        }
    }

    function getClearInputFile() {
        ref.current.value = '';
        setIsImg(true);
        setImgSrc(null);
    }
    return (
        <div className={s.wrapper}>
            <form onSubmit={saveTicket}>
                <div key={selectedTicket[indexTicket].questionId}>
                    {imgSrc ? (
                        <div className={s.wrapperImg}>
                            <img className={s.picture} src={imgSrc} alt='Обновите страницу' />
                            <img className={s.logoDeleteImg} onClick={getClearInputFile} src={logoDeleteImg} alt='logoDeleteImg' />
                        </div>
                    ) : (
                        <div className={`${s.withoutPicture} `} >Вопрос без рисунка</div>
                    )}

                    <input
                        ref={ref}
                        onInput={event => {
                            const file = event.target.files[0];
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = e => {
                                setImgSrc(e.target.result);
                            };
                        }}
                        name='img'
                        type='file'
                    />

                    <InputQuestion question={selectedTicket[indexTicket].question} />

                    <div>
                        {selectedTicket[indexTicket].answers.map((answer, i) => {
                            return (
                                <InputAnswer
                                    key={`${answer}${i + 1}`}
                                    answerText={answer.answerText}
                                    correctAnswer={correctAnswer}
                                    isChecked={i === correctAnswer ? true : ''}
                                    i={i}
                                />
                            );
                        })}
                    </div>

                    <InputHelp helpText={selectedTicket[indexTicket].help} />
                </div>

                <div className={s.wrapperBtns}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button type='submit' className={s.btn}>
                            Сохранить изменения
                        </button>
                        {isGif && <img className={s.gif} src={gif} alt='gif' />}
                    </div>

                    <DeleteQuestion idSelectedTicket={idSelectedTicket} questionId={selectedTicket[indexTicket].questionId} />
                </div>
            </form>
        </div>
    );
}

export default EditQuestion;
