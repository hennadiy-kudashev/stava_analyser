import React, { PropTypes } from "react";
import TotalSummary from "../../../logic/totalSummary";
import PeriodSummary from "../../../logic/periodSummary";
import thresholds from "./thresholds";
import thresholdBYs from "./thresholdBYs";
import ProgressBar from "./ProgressBar";
import BaseView from "./BaseView";

class Progress extends BaseView {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const challenge = this.getChallenge();
    const user = this.getUser();

    const joinedAthlete = challenge.athletes.find(a => a.info.id === user.id);
    if (!joinedAthlete) {
      return (<div/>);
    }
    const thresholdCriteria = this.getThresholdCriterion();
    const threshold = this.getThresholdValue();
    const thresholdLabel = thresholds[thresholdCriteria].label;
    const Component = thresholds[thresholdCriteria].component;
    const by = challenge.criteria.threshold.by;
    const summaryClass = thresholdBYs[by].summaryClass;
    if (summaryClass) {
      const unitSummary = new summaryClass(
        challenge.criteria.datetime.after,
        challenge.criteria.datetime.before,
        threshold,
        by,
        challenge.criteria.minActivities
      );
      return (<div>
          {unitSummary.getPeriodDiff(joinedAthlete.activities, thresholdCriteria).map(({ label, monthTotal, monthNorm, summary, isFailed }) => {
            return (
              <ProgressBar
                key={label}
                achieved={monthTotal}
                threshold={monthNorm}
                Component={Component}
                label={`${thresholdLabel} ${label}`}
                summary={summary}
                isFailed={isFailed}
              />
            );
          })}
        </div>
      );
    }
    const achieved = new TotalSummary(joinedAthlete.activities).getByCriterion(thresholdCriteria);
    const periodSummary = new PeriodSummary(challenge.criteria.datetime.after, challenge.criteria.datetime.before);
    return (
      <ProgressBar
        achieved={achieved}
        threshold={threshold}
        Component={Component}
        label={thresholdLabel}
        summary={periodSummary.getSummary()}
        isFailed={periodSummary.isEnded() ? achieved < threshold : false}
      />
    );
  }
}

Progress.propTypes = {
  challenge: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default Progress;
