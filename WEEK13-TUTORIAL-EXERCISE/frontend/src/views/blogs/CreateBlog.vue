<template>
  <div class="container is-widescreen">
    <section class="section" v-if="error">
      <div class="container is-widescreen">
        <div class="notification is-danger">
          <!-- <%= error.code + ': ' + error.sqlMessage %> -->
          <!---->
          {{ error }}
        </div>
      </div>
    </section>
    <section class="hero">
      <div class="hero-body">
        <p class="title">Create new Blog</p>
      </div>
    </section>
    <section class="px-6">
      <div class="mb-5">
        <input
          :class="{ 'is-danger': $v.images.$error }"
          multiple
          type="file"
          accept="image/png, image/jpeg, image/webp"
          @change="selectImages"
        />
        <template v-if="$v.images.$error">
          <p class="help is-danger" v-if="!$v.images.required">
            This field is required
          </p>
          <p class="help is-danger" v-else-if="!$v.images.size">
            Max size is 1MB
          </p>
        </template>
      </div>

      <div v-if="images" class="columns is-multiline">
        <div
          v-for="(image, index) in images"
          :key="image.id"
          class="column is-one-quarter"
        >
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="showSelectImage(image)" alt="Placeholder image" />
              </figure>
            </div>
            <footer class="card-footer">
              <a
                @click="deleteSelectImage(index)"
                class="card-footer-item has-text-danger"
                >Delete</a
              >
            </footer>
          </div>
        </div>
      </div>

      <div class="field mt-5">
        <label class="label">Title</label>
        <div class="control">
          <input
            v-model="$v.titleBlog.$model"
            :class="{ 'is-danger': $v.titleBlog.$error }"
            class="input"
            type="text"
            placeholder="Text input"
          />
        </div>
        <template v-if="$v.titleBlog.$error">
          <p class="help is-danger" v-if="!$v.titleBlog.required">
            This field is required
          </p>
          <p class="help is-danger" v-else-if="!$v.titleBlog.minLength">
            Min length is 10
          </p>
          <p class="help is-danger" v-else-if="!$v.titleBlog.maxLength">
            Max length is 25
          </p>
          <p class="help is-danger" v-else-if="!$v.titleBlog.aToZOnly">
            Only A-Z
          </p>
        </template>
      </div>

      <div class="field">
        <label class="label">Content</label>
        <div class="control">
          <textarea
            v-model="$v.contentBlog.$model"
            :class="{ 'is-danger': $v.contentBlog.$error }"
            class="textarea"
            placeholder="Textarea"
          ></textarea>
        </div>
        <template v-if="$v.contentBlog.$error">
          <p class="help is-danger" v-if="!$v.contentBlog.required">
            This field is required
          </p>
          <p class="help is-danger" v-else-if="!$v.contentBlog.minLength">
            Min length is 50
          </p>
        </template>
      </div>

      <div class="field">
        <label class="label">Reference</label>
        <div class="control">
          <input
            v-model="$v.reference.$model"
            :class="{ 'is-danger': $v.reference.$error }"
            class="input"
            type="url"
            placeholder="e.g. https://www.google.com"
          />
        </div>
        <template v-if="$v.reference.$error">
          <p class="help is-danger" v-if="!$v.reference.url">
            Wrong url format
          </p>
        </template>
      </div>

      <div class="control mb-3">
        <label class="radio">
          <input
            v-model="statusBlog"
            type="radio"
            name="answer"
            value="status_private"
          />
          Private
        </label>
        <label class="radio">
          <input
            v-model="statusBlog"
            type="radio"
            name="answer"
            value="status_public"
          />
          Public
        </label>
      </div>

      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input v-model="pinnedBlog" type="checkbox" />
            Pinned
          </label>
        </div>
      </div>

      <hr />

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">วันที่โพสต์</label>
            <div class="control">
              <input
                v-model="$v.start_date.$model"
                :class="{ 'is-danger': $v.start_date.$error }"
                class="input"
                type="date"
              />
            </div>
          </div>
          <template v-if="$v.start_date.$error">
            <p class="help is-danger" v-if="!$v.start_date.required">
              กรุณากรอกวันที่เริ่มโพสต์
            </p>
            <p class="help is-danger" v-else-if="!$v.start_date.date">
              กรุณากรอกวันที่ให้ถูกต้อง
            </p>
          </template>
        </div>
        <div class="column">
          <div class="field">
            <label class="label">วันสิ้นสุดโพสต์</label>
            <div class="control">
              <input
                v-model="$v.end_date.$model"
                :class="{ 'is-danger': $v.end_date.$error }"
                class="input"
                type="date"
              />
            </div>
          </div>
          <template v-if="$v.end_date.$error">
            <p class="help is-danger" v-if="!$v.end_date.required">
              กรุณากรอกวันสิ้นสุดโพสต์
            </p>
            <p class="help is-danger" v-else-if="!$v.end_date.date">
              กรุณากรอกวันที่ให้ถูกต้อง
            </p>
          </template>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button @click="submitBlog" class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button @click="$router.go(-1)" class="button is-link is-light">
            Cancel
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import {
  required,
  email,
  minLength,
  sameAs,
  maxLength
} from "vuelidate/lib/validators";

export default {
  data() {
    return {
      blog: {},
      error: null,
      images: [], // array of image
      titleBlog: "",
      contentBlog: "",
      pinnedBlog: false,
      statusBlog: "status_public",
      reference: "",
      start_date: "",
      end_date: ""
    };
  },
  validations: {
    titleBlog: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(25),
      aToZOnly: value => {
        return /^[a-zA-Z]+$/.test(value);
      }
    },
    contentBlog: {
      required,
      minLength: minLength(50)
    },
    reference: {
      url: value => {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
      }
    },
    start_date: {
      required: (value, v) => {
        v.$v.$touch();
        return (
          (value != "" && v.end_date != "") ||
          (value == "" && v.end_date == "") ||
          value != ""
        );
      },
      date: (value, v) => {
        //start date must be less than end date
        return value < v.end_date || (value == "" && v.end_date == "");
      }
    },
    end_date: {
      required: (value, v) => {
        v.$v.$touch();
        return (
          (value != "" && v.start_date != "") ||
          (value == "" && v.start_date == "") ||
          value != ""
        );
      },
      date: (value, v) => {
        //end date must be greater than start date
        return value > v.start_date || (value == "" && v.start_date == "");
      }
    },
    images: {
      required: (value, v) => {
        return value.length > 0;
      },
      size: value => {
        let result = true;
        value.forEach(image => {
          if (image.size > 1000000) {
            result = false;
            return result
          }
        });
        return result;
      }
    }
  },
  methods: {
    selectImages(event) {
      this.images = event.target.files;
    },
    showSelectImage(image) {
      // for preview only
      return URL.createObjectURL(image);
    },
    deleteSelectImage(index) {
      console.log(this.images);
      this.images = Array.from(this.images);
      this.images.splice(index, 1);
    },
    submitBlog() {
      this.$v.$touch();
      let formData = new FormData();
      formData.append("title", this.titleBlog);
      formData.append("content", this.contentBlog);
      formData.append("pinned", this.pinnedBlog ? 1 : 0);
      formData.append("reference", this.reference);
      formData.append("start_date", this.start_date);
      formData.append("end_date", this.end_date);
      formData.append("status", this.statusBlog);
      this.images.forEach(image => {
        formData.append("myImage", image);
      });

      // Note ***************
      // ตอนเรายิง Postmant จะใช้ fromData
      // ตอนยิงหลาย ๆ รูปพร้อมกันใน Postman จะเป็นแบบนี้

      // title   | "This is a title of blog"
      // comment | "comment in blog"
      // ...
      // myImage | [select file 1]
      // myImage | [select file 2]
      // myImage | [select file 3]

      // จะสังเกตุว่าใช้ myImage เป็น key เดียวกัน เลยต้องเอามา loop forEach
      // พอไปฝั่ง backend มันจะจัด file ให้เป็น Array เพื่อเอาไปใช้งานต่อได้

      axios
        .post("http://localhost:3000/blogs", formData)
        .then(res => this.$router.push({ name: "home" }))
        .catch(e => console.log(e.response.data));
    }
  }
};
</script>

<style></style>
