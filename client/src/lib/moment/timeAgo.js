import moment from "moment";

export const timeAgoFromNow = (dateTime) => {
    let now = moment(new Date());

    let duration = moment.duration(now.diff(dateTime));

    let seconds = duration.asSeconds();
    let minute = duration.asMinutes();
    let hours = duration.asHours();
    let days = duration.asDays();
    let weeks = duration.asWeeks();
    let month = duration.asMonths();
    let year = duration.asYears();

    if (minute < 1) {
        return parseInt(seconds) + '초 전'
    } else if (hours < 1) {
        return parseInt(minute) + '분 전'
    } else if (hours < 24) {
        return parseInt(hours) + '시간 전'
    } else if (weeks < 1) {
        return parseInt(days) + '일 전'
    } else if (month < 1) {
        return parseInt(weeks) + '주 전'
    } else if (year < 1) {
        return parseInt(month) + '달 전'
    } else {
        return parseInt(year) + '년 전'
    }
};

export const setTime = (createdAt, updatedAt) => {
    if (createdAt !== updatedAt) {
      return (
        moment.utc(updatedAt).lang("ko").format("YYYY년 MMMM Do dddd") +
        " (수정됨)"
      );
    } else {
      return moment.utc(createdAt).lang("ko").format("YYYY년 MMMM Do dddd");
    }
};