<template>
  <section class="expense-section">
    <h3 class="title">EXPENSE SECTION</h3>
    <div class="expenses-section_title">
      <h4 class="expenses-section_title_date">Date</h4>
      <h4 class="expenses-section_title_descr">Description</h4>
      <h4 class="expenses-section_title_type">Type</h4>
      <h4 class="expenses-section_title_amount">Amount</h4>
    </div>
    <div class="expenses-section_line"></div>
    <article>
      <div class="expense-item-wrapper">
        <h4 class="expenses-item-date">09/08/2022</h4>
        <h4 class="expenses-item-descr">Bought a new car</h4>
        <h4 class="expenses-item-type">
          <div class="type-color-background"></div>
          Entertainment
        </h4>
        <h4 class="expenses-item-amount">$500</h4>
      </div>
      <div class="expenses-section_line"></div>
    </article>

    <!-- ADD expenses section -->
    <section class="add-expense">
      <div>
        <label for="input-expense">Source: </label>
        <br>
      <input type="text" name="" id="input-expense">
      </div>
      <div>
        <label for="input-expense">Type: </label>
        <br>
      <input type="text" name="" id="input-expense">
      </div>
      <div>
        
        <label for="input-expense">Amount: </label>
        <br>
      <input type="text" name="" id="input-expense">
        </div>
    </section>
  </section>
</template>

<style scoped>
.title {
  font-weight: 500;
}
.expenses-section_title,
.expense-item-wrapper {
  display: flex;
}

h4[class^="expenses-section_title"] {
  font-weight: 400;
}

.expense-item-wrapper h4 {
  font-weight: 300;
}

.expenses-section_title_date,
.expenses-item-date {
  flex: 1;
}

.expenses-section_title_descr,
.expenses-item-descr {
  flex: 1.5;
}

.expenses-section_title_type,
.expenses-item-type {
  flex: 1;
}

.expenses-item-type {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.expenses-section_title_amount,
.expenses-item-amount {
  flex: 0.5;
}

.expenses-type-color {
  height: 10px;
  width: 10px;
  border-radius: 30px;
  background: pink;
}

.entertainment {
  position: relative;
}

.type-color-background {
  height: 10px;
  width: 10px;
  background: #ff8302;
  top: 0px;
  border-radius: 10px;
}

.expenses-section_line {
  height: 0.5px;
  background: lightgray;
  width: 100%;
}

.add-expense{
display: flex;
    position: absolute;
    bottom: 27px;
    column-gap: 30px;
}

.expense-section{
  position: relative
}


/* .entertainment::after{
  position: absolute;
  content: '';
  height: 10px;
  width: 10px;
  background: pink;
  top: 0px;
  left: -12px
} */
</style>