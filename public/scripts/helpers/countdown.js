/*
Function that updates the remaining time until a specified estimated ready time.
If the time remaining is less than zero, it clears the interval.
*/


const orderRemainingTimeIntervals = {};

const updateRemainingTime = (estimated_ready_at, order_id) => {
  clearInterval(orderRemainingTimeIntervals[order_id]);

  const dateExpectedReadyAt = new Date(estimated_ready_at);
  const msSinceEpoch = dateExpectedReadyAt.getTime();

  orderRemainingTimeIntervals[order_id] = setInterval(() => {
    const timeRemaining = msSinceEpoch - Date.now();

    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    $(`#countdown_${order_id}`).empty();
    $(`#countdown_${order_id}`).append(
      `Time remaining: ${String(hours).padStart(2, "0")} : ${String(
        minutes
      ).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`
    );

    if (timeRemaining < 0) {
      clearInterval(orderRemainingTimeIntervals[order_id]);
      $(`#countdown_${order_id}`).empty();
      $(`#countdown_${order_id}`).append(`Time's up!`);
    }
  }, 1000);
};
