import './index.scss';

import Header     from '~common/components/header';
import Models     from '~common/models';

export default {
  name: 'messageReward',
  data () {
    return {
      /*
       * 分页
       */
      page          : 1,
      total         : 1,
      per_page      : 1,
      current_page  : 1,
      last_page     : 1,

      formTemp: {
        list: '',
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getList();
  },
  watch: {

  },
  methods: {

    /*
     * 获取通知列表
     */
    getList () {
      let self = this;
      Models.Notify
      .index({
        params: {
          page: self.page,
          type: self.$route.query.type,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (1 === self.page) {
            self.formTemp.list = [];
          }
          data.data.forEach((item) => {
            self.formTemp.list.push(item);
          });
          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
        }
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getList();
        done();
      }, 1500);
    },

    infinite (done) {
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.getList();
        done();
      }, 1500);
    },

  },
};