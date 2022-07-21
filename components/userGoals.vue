<template>
  <div class="goals-section">
    <h3>Current Goals</h3>
    <div class="progress-section">
      <div class="ticks">
        <div class="tick-25">
          <h4>25%</h4>
          <div class="tick-height"></div>
        </div>
        <div class="tick-25">
          <h4>50%</h4>
          <div class="tick-height"></div>
        </div>
        <div class="tick-25">
          <h4>75%</h4>
          <div class="tick-height"></div>
        </div>
      </div>
      <progress class="current-goal-progress" value="39" max="100">
        32%
      </progress>
    </div>

    <!-- Divider -->
    <br><br>
    <div class="divider"></div>
    <br><br>

    <!-- Sign out -->
    <div style="display: flex; align-items: center; column-gap: 10px; cursor: pointer">
        <h3>Sign Out</h3>
        <img src="../assets/images/sign-out-icon.png" alt="Sign out icon from icons8" class="sign-out-icon">
    </div>
  </div>
</template>

<style scoped>
.goals-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.goals-section h3 {
  font-weight: 400;
}

.current-goal-progress {
  /* height: 55px; */
  accent-color: #468c5f;
}

.current-goal-progress {
  border: 0;
  height: 40px;
  border-radius: 20px;
  width: 20vw;
}
.current-goal-progress::-webkit-progress-bar {
  border: 0;
  height: 40px;
  border-radius: 20px;
  background: #42865a97;
}
.current-goal-progress::-webkit-progress-value {
  border: 0;
  height: 40px;
  border-radius: 20px;
}
.current-goal-progress::-moz-progress-bar {
  border: 0;
  height: 40px;
  border-radius: 20px;
}

.tick-height {
  height: 20px;
  background: #b7b7b7;
  width: 1px;
}

.ticks {
  display: flex;
  justify-content: space-around;
}

.tick-25 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ticks div h4 {
  margin-bottom: 0px;
  font-weight: 400;
}

.divider{
    height: 5px;
    width: 270px;
    background: #42865a97;
    border-radius: 10px;
}

.sign-out-icon{
    width: 15px;
}
</style>