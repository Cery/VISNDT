import { useState } from 'react';
import { Button, Modal, Upload, message, Alert, Typography } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { parseCsvFile } from '../../utils/import';
import type { ImportResult } from '../../utils/import';

const { Dragger } = Upload;
const { Text, Paragraph } = Typography;

interface ImportButtonProps {
  /** Called with parsed CSV data on confirm */
  onImport: (data: ImportResult) => Promise<void>;
  /** Module name for display */
  moduleName: string;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

export default function ImportButton({
  onImport,
  moduleName,
  loading = false,
  disabled = false,
}: ImportButtonProps) {
  const [open, setOpen] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect: UploadProps['beforeUpload'] = (uploadFile) => {
    setFile(uploadFile);
    setImportResult(null);
    setError(null);

    parseCsvFile(uploadFile)
      .then((result) => {
        setImportResult(result);
        if (result.parseErrors.length > 0) {
          setError(result.parseErrors.join('; '));
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '文件解析失败');
        setImportResult(null);
      });

    // Prevent auto-upload
    return false;
  };

  const handleImport = async () => {
    if (!importResult || importResult.rows.length === 0) {
      message.warning('没有可导入的数据');
      return;
    }

    setImporting(true);
    try {
      await onImport(importResult);
      message.success(`成功导入 ${importResult.rows.length} 条${moduleName}数据`);
      setOpen(false);
      setImportResult(null);
      setFile(null);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '导入失败');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setImportResult(null);
    setFile(null);
    setError(null);
  };

  return (
    <>
      <Button
        icon={<UploadOutlined />}
        loading={loading}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        导入
      </Button>

      <Modal
        title={`导入${moduleName}`}
        open={open}
        onOk={handleImport}
        onCancel={handleClose}
        okText="确认导入"
        cancelText="取消"
        confirmLoading={importing}
        okButtonProps={{ disabled: !importResult || importResult.rows.length === 0 || !!error }}
        width={560}
      >
        <Paragraph type="secondary" style={{ marginBottom: 16, fontSize: 13 }}>
          支持 CSV 格式文件。第一行为表头，后续行为数据行。请确保文件编码为 UTF-8。
        </Paragraph>

        <Dragger
          accept=".csv"
          maxCount={1}
          beforeUpload={handleFileSelect}
          fileList={file ? [{ uid: '-1', name: file.name, status: 'done' }] : []}
          onRemove={() => {
            setFile(null);
            setImportResult(null);
            setError(null);
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽 CSV 文件到此区域</p>
          <p className="ant-upload-hint">仅支持 .csv 格式文件</p>
        </Dragger>

        {importResult && (
          <div style={{ marginTop: 16 }}>
            <Text strong>
              解析结果：{importResult.totalRows} 条数据，{importResult.headers.length} 列
            </Text>
            {importResult.headers.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  列名：{importResult.headers.join(', ')}
                </Text>
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert
            type="warning"
            message="解析警告"
            description={error}
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Modal>
    </>
  );
}