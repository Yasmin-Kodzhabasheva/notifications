import { useState } from "react";
import useFetch from "../hooks/useFetch";

const months = {
    '01': 'Jan.',
    '02': 'Feb.',
    '03': 'Mar.',
    '04': 'Apr.',
    '05': 'May',
    '06': 'Jun.',
    '07': 'Jul.',
    '08': 'Aug.',
    '09': 'Sep.',
    '10': 'Oct.',
    '11': 'Nov.',
    '12': 'Dec.'
}

const Notifications = () => {

    const { data, error } = useFetch();
    const [messageState, setMessageState] = useState(new Set());

    const formatDate = (date) => {
        let dateArray = date.split(' ');
        let [year, month, day] = dateArray[0].split('-')
        let lastChar = day[day.length - 1];

        if (day[0] == 0) day = day[1]

        switch (lastChar) {
            case '1':
                day = day + 'st';
                break;
            case '2':
                day = day + 'nd';
                break;
            case '3':
                day = day + 'rd'
                break;
            default:
                day = day + 'th'
                break;
        }


        return `${months[month]} ${day}`
    }

    const addAdditionalClasses = (element, score) => {
        const classPrefix = element === "message" ? 'messages-' : 'heading-';
        return score <= 5 ? `${classPrefix}low-rate` : `${classPrefix}high-rate`;
    };

    const boxShadowGenerator = (number, threadId) => {
        let startOffset = 10;
        let boxShadow = 'rgba(149, 157, 165, 0.2) 4px 8px 24px,';

        if (isThreadExpanded(threadId)) return;

        for (let index = 0; index < number; index++) {
            boxShadow += `${startOffset}px ${startOffset}px 0 -3px #FCFCFC, ${startOffset}px ${startOffset}px 30px lightgray`;
            if (index < number - 1) {
                boxShadow += ', ';
            }
            startOffset += 10;
        }

        return boxShadow;
    }

    const addContainerClasses = (array, index, threadId) => {
        if (array.length > 1 && index !== 0) {
            return isThreadExpanded(threadId) ? 'notifications-container' : 'notifications-container collapsed-hidden';
        }
        return 'notifications-container';
    };

    const generateCountMessage = (count, score, threadId) => {
        let extraClass = addAdditionalClasses('message', score)

        if (isThreadExpanded(threadId)) return;

        return (
            <p className={`messages-count ${extraClass}`}>
                {count} messages
            </p>
        )

    }

    const expandThread = (threadId) => {
        setMessageState(prevState => new Set(prevState).add(threadId));
    };

    const isThreadExpanded = (threadId) => {
        return messageState.has(threadId);
    };

    const generateView = () => {
        return data.map((element) => (
            element.map((el, index) => (
                <div
                    key={el.id}
                    style={{ boxShadow: boxShadowGenerator(element.length - 1, el.thread_id) }}
                    className={addContainerClasses(element, index, el.thread_id)}
                    onClick={() => expandThread(el.thread_id)}
                >
                    {element.length > 1 && generateCountMessage(element.length, el.score, el.thread_id)}
                    <div className="main-information-container">
                        <div>
                            <h3 className={`notification-heading ${addAdditionalClasses('heading', el.score)}`}>{el.subject}</h3>
                            <p>{el.question}</p>
                        </div>
                        <div className="team-date-container">
                            <p>{el.team}</p>
                            <p>{formatDate(el.created_at)}</p>
                        </div>
                    </div>
                    <div className="text-container">
                        <p>{el.text}</p>
                    </div>
                </div>
            ))
        ));
    };


    return (
        <main className="main-page-container">
            {data ? generateView() : 'Loading data'}
        </main>
    )
}

export default Notifications;