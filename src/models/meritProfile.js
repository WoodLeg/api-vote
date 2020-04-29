import Merit from './merit';
import Mention from './mention';

export default class MeritProfile {
  process(candidate, votes, mentions) {
    let stack = [];

    mentions.forEach(mention => {
      let total = 0;
      let count = 0;

      votes.forEach(vote => {
        let voteHasCandidateName = vote.getCandidate().getName() === candidate.getName();

        if (voteHasCandidateName) {
          total++;
        }
        if (vote.getMention().getLabel() === mention.getLabel() && voteHasCandidateName) {
          count++;
        }
      });

      let merit = new Merit(mention, (count * 100) / total);
      stack.push(merit);
    });

    candidate.addMerits(stack);

    return stack;
  }

  processMajorityMentionFromTop(candidate, votes, mentions) {
    let stack = this.process(candidate, votes, mentions);
    let nbPercent = 0;
    let majorityMention = new Mention();

    for (let index = 0; index < stack.length; index++) {
      let merit = stack[index];
      nbPercent += merit.getPercent();
      if (nbPercent > 50) {
        majorityMention = merit.getMention();
        break;
      }
    }

    let result = { mention: majorityMention, percent: nbPercent };

    return result;
  }

  processMajorityMentionFromBottom(candidate, votes, mentions) {
    let stack = this.process(candidate, votes, mentions);
    stack = stack.reverse();
    let nbPercent = 0;
    let majorityMention = new Mention();

    for (let index = 0; index < stack.length; index++) {
      let merit = stack[index];
      nbPercent += merit.getPercent();
      if (nbPercent > 50) {
        majorityMention = merit.getMention();
        break;
      }
    }

    let result = { mention: majorityMention, percent: nbPercent };
    return result;
  }

  processMajorityMention(candidate, votes, mentions) {
    let fromTopMention = this.processMajorityMentionFromTop(candidate, votes, mentions);
    let fromBottomMention = this.processMajorityMentionFromBottom(candidate, votes, mentions);

    // console.log('MAJORITY MENTION');
    // console.log(candidate);
    // console.log(fromTopMention);
    // console.log(fromBottomMention);
    if (fromTopMention.mention.getLabel() === fromBottomMention.mention.getLabel()) {
      candidate.setMedian(fromBottomMention);
      return fromBottomMention;
    } else {
      // To improve
      candidate.setMedian(fromBottomMention);
      return fromBottomMention;
      // throw new Error('Not found majority mention');
    }
  }
}
