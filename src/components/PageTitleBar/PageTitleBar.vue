<template>
	<v-container fluid>
		<app-card :fullBlock="true">
			<v-breadcrumbs>
				<h2 class="text-capitalize mb-0">{{pageTitle}}</h2>
				<div class="spacer"></div>
				<v-icon slot="divider">chevron_right</v-icon>
				<v-breadcrumbs-item>
					{{pageBreadcrumb}}
				</v-breadcrumbs-item>
			</v-breadcrumbs>
		</app-card>
	</v-container>
</template>

<script>
export default {
  computed: {
    // computed property to get page breadcrumbs
    pageTitle() {
      return this.$route.meta.title;
    },
    pageBreadcrumb() {
      return this.$route.meta.breadcrumb;
    }
  }
};
</script>
