import { contentService } from '../../api';
import type { ContentFormData } from '../../types';
import { ContentForm } from '../../components/content';

export default function ContentCreate() {
  const handleSubmit = async (data: ContentFormData) => {
    const created = await contentService.create({
      type: data.type,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
    });
    return created;
  };

  return (
    <ContentForm onSubmit={handleSubmit} submitLabel="创建内容" title="创建内容" />
  );
}